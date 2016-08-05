from datetime import datetime, timedelta
import os

import jwt
from flask import Flask, request, jsonify, abort, session, Response
from werkzeug.security import generate_password_hash, check_password_hash

import asklibs.sessionPickle as newSession
from flask_sqlalchemy import SQLAlchemy
from flask_rbac import RBAC, RoleMixin, UserMixin
from flask_cors import CORS

# Configuration
current_path = os.path.dirname(__file__)
client_path = os.path.abspath(os.path.join(current_path, '..', '..', 'client'))

app = Flask(__name__)
CORS(app, resources=r'*', allow_headers='Content-Type')
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
    new_user_admon = User(email='admonUser', password='qwerasdf', display_name='User admin system', active=True)
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
    active = db.Column(db.Boolean(), default=True)
    new_user = db.Column(db.Boolean(), default=True)
    confirmed_at = db.Column(db.DateTime())
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(45))
    current_login_ip = db.Column(db.String(45))
    login_count = db.Column(db.Integer, default=0)
    # Other columns
    roles = db.relationship(
        'Role',
        secondary=users_roles,
        backref=db.backref('roles', lazy='dynamic')
    )

    def __init__(self, email=None, password=None, display_name=None, first_name=None, last_name=None, active=False):
        if email:
            self.email = email.lower()
        if password:
            self.set_password(password)
        if display_name:
            self.display_name = display_name
        if first_name:
            self.first_name = first_name
        if last_name:
            self.last_name = last_name
        if active:
            self.active = active

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
    token = req.headers.get('Authorization')
    return jwt.decode(token, app.config['TOKEN_SECRET'], 'unicode_escape')


def get_current_user():
    if not request.headers.get('Authorization') or session.get('user_id') is None:
        return None
    try:
        token = parse_token(request)
        current_user = User.query.join(Role, User.roles).filter(User.id == token['sub']).first()
        return current_user
    except jwt.DecodeError:
        response = jsonify(message='Token is invalid')
        response.status_code = 401
        return response
    except jwt.ExpiredSignature:
        response = jsonify(message='Token has expired')
        response.status_code = 401
        return response


@app.after_request
def after_request(Response):
    if request.method == 'OPTIONS':
        Response.status = '200'
        Response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3001'
        Response.headers['Access-Control-Allow-Credentials'] = 'true'
        Response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        Response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE'
        Response.set_data('')
        return Response
    Response.headers['Access-Control-Allow-Credentials'] = 'true'
    return Response


# ------ Routes
@app.route('/', methods=['GET'])
@rbac.allow(['anonymous'], methods=['GET'], with_children=False)
def index():
    ret_dict = {"Key1": "Value1", "Key2": "value2"}
    return jsonify(items=ret_dict)


@app.route('/apiUser/login', methods=['POST', 'OPTIONS'])
@rbac.allow(['anonymous'], methods=['POST', 'OPTIONS'], with_children=False)
def login():
    user_data = {}
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

        if user_logged.active:
            session['user_id'] = user_logged.id
            user_data['login_count'] = user_logged.login_count + 1
            user_data['last_login_ip'] = user_logged.current_login_ip
            user_data['current_login_ip'] = request.host
            user_data['last_login_at'] = user_logged.current_login_at
            user_data['current_login_at'] = datetime.utcnow()

            User.query.filter(User.id == user_logged.id).update(user_data)
            db.session.commit()

            token = create_token(user_logged)
            return jsonify({"jsonrpc": "2.0", "result": True, "token": token}), 202
        else:
            return abort(404, jsonify({"jsonrpc": "2.0", "result": False}))


@app.route('/apiUser/newuser', methods=['POST'])
@rbac.allow(['anonymous'], methods=['POST'], with_children=False)
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


@app.route('/apiUser/updateUser', methods=['PUT'])
@rbac.allow(['candidate'], methods=['PUT'])
def update_user():
    json_data = request.get_json()
    if json_data.has_key('params') and len(json_data.get('params')) != 0:
        for key, value in json_data.get('params').items():
            if len(value) < 3:
                del json_data['params'][key]
        if len(json_data.get('params')) == 0:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))

    user_db = get_current_user()
    User.query.filter(User.id == user_db.id).update(json_data['params'])
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@app.route('/apiUser/logout', methods=['PUT', 'OPTIONS'])
@rbac.allow(['candidate', 'admon'], methods=['PUT', 'OPTIONS'])
def logout_user():
    # TODO: update register user
    # User.query.filter(User.id==user_db.id).update(json_data['params'])
    # db.session.commit()
    session.clear()
    return jsonify({"jsonrpc": "2.0", "result": True}), 202


@app.route('/apiQuestionary/assigned', methods=['GET'])
@rbac.allow(['candidate'], methods=['GET'])
def assigned_questionnaires():
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@app.route('/apiAdmin/users', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def apiadmin_users():
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@app.route('/apiAdmin/allRoles', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def apiadmin_roles_all():
    roles_all = Role.query.with_entities(Role.id,Role.name, Role.description).all()
    dict_roles = [dict(zip(('id','nomb','description'), r)) for r in roles_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_roles)), 200


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