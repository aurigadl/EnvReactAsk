from datetime import datetime, timedelta
import os
import jwt
import asklibs.sessionPickle as newSession
from functools import wraps
from flask import Flask, g, request, jsonify, abort, session, current_app
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


def init_db():
    """Initializes the database."""
    if os.path.exists('app.db'):
        os.remove('app.db')

    db.create_all()
    new_role_basic = Role('candidate', 'They may present test')
    new_role_admon = Role('admon', 'They may to do anything')
    new_user_admon = User(email='admonUser', password='qwerasdf', display_name='User admin system')
    new_user_admon.add_role(new_role_admon)
    db.session.add(new_role_basic)
    db.session.add(new_role_admon)
    db.session.add(new_user_admon)
    db.session.commit()
    db.create_all()


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
        'exp': datetime.utcnow() + timedelta(days=1)
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
            parse_token(request)
        except jwt.DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except jwt.ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response
        return f(*args, **kwargs)

    return decorated_function


def get_current_user():
    if session.get('user_id') is not None:
        current_user = User.query.join(Role, User.roles).filter(User.id == session.get('user_id')).first()
        return current_user
    else:
        # Return empty user used for anonymous register
        return None


# ------ Routes
@app.route('/', methods=['GET'])
def index():
    ret_dict = {"Key1": "Value1", "Key2": "value2"}
    return jsonify(items=ret_dict)


@app.route('/apiQuestionary/assigned', methods=['GET'])
@rbac.allow(['candidate'], methods=['GET'])
@login_required
def assigned_questionnaires():
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@app.route('/apiAdmin/users', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
@login_required
def apiadmin_users():
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@app.route('/apiUser/login', methods=['GET'])
def login():
    if not hasattr(request.json, 'get'):
        abort(400, 'does not have the correct json format')
    r_email = request.json.get('usermail')
    r_password = request.json.get('password')
    if r_email is None or r_password is None or len(r_email) < 5 or len(r_password) < 7:
        return abort(401, jsonify({"jsonrpc": "2.0", "result": False}))
    else:
        lower_user_mail = r_email.lower()
        user_logged = User.query.join(Role, User.roles).filter(User.email == lower_user_mail).first()
        if not user_logged or not user_logged.check_password(r_password):
            return abort(404, jsonify({"jsonrpc": "2.0", "result": False}))

        # Loading importan information from user to used in other request
        session['user_id'] = user_logged.id
        session['user_time_init'] = datetime.utcnow()

        token = create_token(user_logged)
        return jsonify({"jsonrpc": "2.0", "result": True, "token": token}), 202


@app.route('/apiUser/newuser', methods=['POST'])
def new_user():
    if not hasattr(request.json, 'get'):
        abort(400, 'does not have the correct json format')
    usermail = request.json.get('usermail')
    password = request.json.get('password')
    display_name = request.json.get('name_to_show')
    if usermail is None or password is None or len(usermail) < 5 or len(password) < 7:
        abort(400, 'missing arguments')
    lower_user_mail = usermail.lower()
    if User.query.filter_by(email=lower_user_mail).first() is not None:
        abort(400, 'existing user')
    new_user_db = User(email=lower_user_mail, password=password, display_name=display_name)
    new_user_db.add_role(Role.get_by_name('candidate'))
    db.session.add(new_user_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True}), 201


if __name__ == '__main__':

    path = './app_session'
    if not os.path.exists(path):
        os.mkdir(path)
        os.chmod(path, int('700', 8))

    init_db()
    rbac.set_role_model(Role)
    rbac.set_user_model(User)
    rbac.set_user_loader(get_current_user)
    app.session_interface = newSession.PickleSessionInterface(path)

    app.run(host='0.0.0.0', port=5000, debug=True)
