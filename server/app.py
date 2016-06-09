from datetime import datetime, timedelta
import os
import jwt
from functools import wraps
from flask import Flask, g, request, jsonify, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from jwt import DecodeError, ExpiredSignature
from flask.ext.rbac import RBAC, RoleMixin, UserMixin


# Configuration
current_path = os.path.dirname(__file__)
client_path = os.path.abspath(os.path.join(current_path, '..', '..', 'client'))

app = Flask(__name__)
app.config.from_object('config')
rbac = RBAC(app)
db = SQLAlchemy(app)


roles_parents = db.Table('roles_parents',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True),
    db.Column('parent_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
)


@rbac.as_role_model
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    modified_at = db.Column(db.DateTime, default=db.func.current_timestamp(),
                            onupdate=db.func.current_timestamp())

    name = db.Column(db.String(80), nullable=False, unique=True)
    description = db.Column(db.String(255))

    parents = db.relationship(
        'Role',
        secondary=roles_parents,
        primaryjoin=(id == roles_parents.c.role_id),
        secondaryjoin=(id == roles_parents.c.parent_id),
        backref=db.backref('children', lazy='dynamic')
    )

    def __init__(self, name):
        RoleMixin.__init__(self)
        self.name = name

    def add_parent(self, parent):
        # You don't need to add this role to parent's children set,
        # relationship between roles would do this work automatically
        self.parents.append(parent)

    def add_parents(self, *parents):
        for parent in parents:
            self.add_parent(parent)

    @staticmethod
    def get_by_name(name):
        return Role.query.filter_by(name=name).first()


users_roles = db.Table(
    'users_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
)


@rbac.as_user_model
class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    modified_at = db.Column(db.DateTime, default=db.func.current_timestamp(),
                            onupdate=db.func.current_timestamp())
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(120))
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(45))
    current_login_ip = db.Column(db.String(45))
    login_count = db.Column(db.Integer)
    # Other columns
    roles = db.relationship(
        'Role',
        secondary=users_roles,
        backref=db.backref('roles', lazy='dynamic')
    )

    def __init__(self, email=None, password=None, display_name=None):
        if email:
            self.email = email.lower()
        if password:
            self.set_password(password)
        if display_name:
            self.display_name = display_name

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def add_role(self, role):
        self.roles.append(role)

    def add_role(self, roles):
        for role in roles:
            self.add_role(role)

    def get_roles(self):
        for role in self.roles:
            yield role

    def to_json(self):
        return dict(id=self.id, email=self.email, displayName=self.display_name)


def create_token(user):
    payload = {
        'sub': user.id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=14)
    }
    token = jwt.encode(payload, app.config['TOKEN_SECRET'])
    return token.decode('unicode_escape')


def parse_token(req):
    token = req.headers.get('Authorization').split()[1]
    return jwt.decode(token, app.config['TOKEN_SECRET'])


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response

        try:
            payload = parse_token(request)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        g.current_user = payload['sub']
        return f(*args, **kwargs)
    return decorated_function


# Create a user to test with
@app.before_first_request
def create_user_role():
    db.create_all()
    if not User.query.first():
        anon = Role('anonymous')
        guest = User(email='guest@sindominio.co', password='1234',
                     display_name='Anonymous')
        guest.roles.append(anon)
        db.session.add(anon)
        db.session.add(guest)
        db.session.commit()
        db.create_all()
        g.current_user = guest
        print guest.to_json()


def get_current_user():
    if not hasattr(g, 'current_user'):
        q = User.query.filter(User.email == 'guest@sindominio.co').first()
        if q:
            g.current_user = q
    return g.current_user


rbac.set_user_loader(get_current_user)


# ------ Routes
@app.route('/')
def index():
    ret_dict = {
        "Key1": "Value1",
        "Key2": "value2"
    }
    return jsonify(items=ret_dict)


@rbac.allow(['anonymous'], methods=['GET'])
@app.route('/nim')
def nim():
    ret_dict = {
        "Key2": ":P"
    }
    return jsonify(items=ret_dict)



@app.route('/api/me')
@login_required
def me():
    user = User.query.filter_by(id=g.user_id).first()
    return jsonify(user.to_json())


@rbac.allow(['anonymous'], methods=['POST'])
@app.route('/auth/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user or not user.check_password(request.json['password']):
        response = jsonify(message='Wrong Email or Password')
        response.status_code = 401
        return response
    token = create_token(user)
    return jsonify(token=token)


@app.route('/api/users', methods=['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)    # existing user
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    token = create_token(user)
    return (jsonify({'username': user.username}, token=token), 201,
            {'Location': url_for('get_user', id=user.id, _external=True)})


@app.route('/auth/signup', methods=['POST'])
def signup():
    user = User(email=request.json['email'], password=request.json['password'])
    db.session.add(user)
    db.session.commit()

if __name__ == '__main__':
    if not os.path.exists('db.sqlite'):
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)