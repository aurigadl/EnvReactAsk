import os
import jwt
from flask import Flask, request, jsonify, session

import config as config
import libs.sessionPickle as newSession

from shared.models import db, rbac,g_data
from apiUser.models import Role, User
from apiUser.apiUser import apiUser
from apiRole.apiRole import apiRole
from apiMarcas.apiMarca import apiMarca

# Configuration
app = Flask(__name__, static_folder='./static', static_url_path='')
app.config.from_object(config)
db.app = app
db.init_app(app)
rbac.init_app(app)

app.register_blueprint(apiUser)
app.register_blueprint(apiRole)
app.register_blueprint(apiMarca)


def init_db():
    """Initializes the database."""
    if os.path.exists('app.db'):
        os.remove('app.db')
    db.create_all()
    new_role_basic = Role('candidate', 'They may present test')
    new_role_admon = Role('admon', 'They may to do anything')
    new_user_admon = User(email='admon@midominio.co', password='qwerasdf', display_name='User admin system', active=True)
    new_user_admon.add_role(new_role_admon)
    db.session.add(new_role_basic)
    db.session.add(new_role_admon)
    db.session.add(new_user_admon)
    db.session.commit()
    db.create_all()


def parse_token(req):
    token = req.headers.get('Authorization')
    return jwt.decode(token, app.config['TOKEN_SECRET'], 'unicode_escape')


def get_current_user():
    if not request.headers.get('Authorization') or session.get('user_id') is None:
        return None
    try:
        token = parse_token(request)
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


if __name__ == '__main__':

    rbac.set_user_loader(get_current_user)
    path = './tmp_app_session'
    if not os.path.exists(path):
        os.mkdir(path)
        os.chmod(path, int('700', 8))
    rbac.set_role_model(Role)
    rbac.set_user_model(User)
    init_db()
    app.session_interface = newSession.PickleSessionInterface(path)
    app.run()