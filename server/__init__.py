import os
import sys
import jwt
import time
import logging
from flask import Flask, request, jsonify, session
from server import config
from logging import FileHandler
from flask_sqlalchemy import SQLAlchemy
from flask import g
from rbac import RBAC as r
import libs.sessionPickle as newSession

try:
    appEnv = os.environ["APPFLASK_A"]
except KeyError:
    print "#####################################################\n" \
          "##  Please set the environment variable APPFLASK_A\n" \
          "#####################################################\n" \
          "APPFLASK_A = ['DEV', 'PRO']\n" \
          "put var APPFLASK_A in ~/bashrc like\n" \
          "export APPFLASK_A=DEV or APPFLASK_A=PRO\n"
    sys.exit(1)

rbac = r.RBAC()
db = SQLAlchemy()
g_data = g

# Configuration
app = Flask(__name__, static_folder='./static', static_url_path='')
if appEnv=='DEV':
    app.config.from_object(config.devConfig1)
if appEnv=='PRO':
    app.config.from_object(config.config)
db.app = app
db.init_app(app)
rbac.init_app(app)

from server.apiUser.models import User
from server.apiRole.models import Role
from server.apiUser.api import apiUser
from server.apiRole.api import apiRole
from server.apiMarcas.api import apiMarca
from server.apiSystem.api import apiSystem
from server.apiRuta.api import apiRuta
from server.apiTipoContrato.api import apiTipoContrato

app.register_blueprint(apiUser)
app.register_blueprint(apiRole)
app.register_blueprint(apiSystem)
app.register_blueprint(apiMarca)
app.register_blueprint(apiRuta)
app.register_blueprint(apiTipoContrato)

# configure Flask logging
logger = FileHandler('error.log')
app.logger.setLevel(logging.DEBUG)
app.logger.addHandler(logger)


def init_db():
    """Initializes the database."""
    db.create_all()
    new_role_basic = Role('candidate', 'They may present test')
    new_role_admon = Role('admon', 'They may to do anything')
    new_user_admon = User(email='admon@mi.co',
            password='Abcd1234',
            display_name='User admin system',
            active=True,
            new_user=False)
    new_user_admon.add_role(new_role_admon)
    db.session.add(new_role_basic)
    db.session.add(new_role_admon)
    db.session.add(new_user_admon)
    db.session.commit()
    db.create_all()


def get_current_user():
    if not request.headers.get('Authorization') or session.get('user_id') is None:
        return None
    try:
        req_token = request.headers.get('Authorization')
        token = jwt.decode(req_token, app.config['TOKEN_SECRET'], 'unicode_escape')
        current_user = User.query.join(Role, User.roles).filter(User.id == token['sub']).first()
        g_data._user_obj = current_user
        return current_user
    except jwt.DecodeError:
        response = jsonify(message='Token is invalid')
        response.status_code = 401
        return response
    except jwt.ExpiredSignature:
        response = jsonify(message='Token has expired')
        response.status_code = 401
        return response


# ------ Routes
@app.route('/', methods=['GET'])
@rbac.allow(['anonymous'], methods=['GET'], with_children=False)
def root():
    return app.send_static_file('index.html')

# log Flask events
app.logger.debug(u"Flask server started " + time.asctime())
@app.after_request
def write_access_log(response):
    app.logger.debug(u"%s %s -> %s" % (time.asctime(), request.path, response.status_code))
    return response

rbac.set_user_loader(get_current_user)
rbac.set_role_model(Role)
rbac.set_user_model(User)

path = './tmp_app_session'
if not os.path.exists(path):
    os.mkdir(path)
    os.chmod(path, int('700', 8))
app.session_interface = newSession.PickleSessionInterface(path)

if appEnv == 'DEV' and os.path.exists('server/app.db'):
    os.remove('server/app.db')
    init_db()

if appEnv == 'PRO' and not os.path.exists('server/app.db'):
    init_db()
