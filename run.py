import os
import jwt
from server import app, rbac, db, Role, User, g_data
from flask import request, jsonify, session
import server.libs.sessionPickle as newSession


def init_db():
    """Initializes the database."""
    if os.path.exists('server/app.db'):
        os.remove('server/app.db')
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