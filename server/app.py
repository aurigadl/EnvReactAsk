from datetime import datetime, timedelta
import os
import jwt
from flask import Flask, g, request, jsonify, abort
from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
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

    def __init__(self, name, description):
        RoleMixin.__init__(self)
        self.name = name
        self.description = description

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

    def add_roles(self, roles):
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
        except jwt.DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except jwt.ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        g.current_user = payload['sub']
        return f(*args, **kwargs)

    return decorated_function


def get_current_user():
    if not hasattr(g, 'user'):
        g.user = User()
    return g.user


# ------ Routes
@app.route('/', methods=['GET'])
def index():
    ret_dict = {"Key1": "Value1", "Key2": "value2"}
    return jsonify(items=ret_dict)


@app.route('/apiuser/login', methods=['GET'])
def login():
    r_email = request.form['email']
    r_password = request.form['password']
    if r_email == '' or r_password == '':
        return abort(401, jsonify({"jsonrpc": "2.0", "result": False}))
    else:
        user = User.query.filter_by(email=r_email).first()
        if not user or not user.check_password(r_password):
            return abort(404, jsonify({"jsonrpc": "2.0", "result": False}))
        token = create_token(user)
        return jsonify({"jsonrpc": "2.0", "result": True, "token":token}), 202


@app.route('/apiuser/newuser', methods=['POST'])
def new_user():
    if not hasattr(request.json, 'get'):
        abort(400, 'does not have the correct json format')
    usermail = request.json.get('usermail')
    password = request.json.get('password')
    display_name = request.json.get('name_to_show')
    if usermail is None or password is None or len(usermail) < 5 or len(password) < 5:
        abort(400, 'missing arguments')
    if User.query.filter_by(email=usermail).first() is not None:
        abort(400, 'existing user')
    new_user_db = User(email=usermail, password=password, display_name=display_name)
    new_user_db.add_role(Role.get_by_name('candidate'))
    db.session.add(new_user_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True}), 201


@app.route('/apiuser/signup', methods=['POST'])
def signup():
    user = User(email=request.json['email'], password=request.json['password'])
    db.session.add(user)
    db.session.commit()


if __name__ == '__main__':

    if os.path.exists('app.db'):
        os.remove('app.db')

    db.create_all()
    anon = Role('candidate', 'They may present evidence only')
    db.session.add(anon)
    db.session.commit()
    db.create_all()

    rbac.set_role_model(Role)
    rbac.set_user_model(User)
    rbac.set_user_loader(get_current_user)
    app.run(host='0.0.0.0', port=5000, debug=True)
