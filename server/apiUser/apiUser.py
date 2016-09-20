from datetime import datetime, timedelta

from flask import Blueprint, request, abort, jsonify, session
import jwt

from shared.models import db, rbac, g_data
from models import Role, User
from config.config import config

apiUser = Blueprint('apiUser', __name__)


def create_token(user):
    payload = {
        'sub': user.id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(payload, config.TOKEN_SECRET)
    return token.decode('unicode_escape')


@apiUser.route('/apiUser/login', methods=['POST', 'OPTIONS'])
@rbac.allow(['anonymous'], methods=['POST', 'OPTIONS'], with_children=False)
def login():
    user_data = {}
    if not hasattr(request.json, 'get') or len(request.json) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 401
    r_email = request.json.get('email')
    password1 = request.json.get('password')

    if r_email is None or len(r_email) < 5:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 401

    lower_user_mail = r_email.lower()

    if password1 is None or len(password1) < 7:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 401

    user_logged = User.query.join(Role, User.roles).filter(User.email == lower_user_mail).first()

    if user_logged is None:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 401

    if user_logged.new_user:
        password2 = request.json.get('password_c')
        if password2 != password1:
            return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Change password'}), 423
        else:
            user_logged.set_password(password1)
            user_data['new_user'] = False
    else:
        if not user_logged.check_password(password1):
            return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 401

    if user_logged.active:
        session['user_id'] = user_logged.id
        session['language'] = 'es'
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
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Usuario Inactivo'}), 403


@apiUser.route('/apiUser/newuser', methods=['POST'])
@rbac.allow(['admon'], methods=['POST'], with_children=False)
def new_user():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    active = True
    new_user = True
    password = datetime.now().strftime('%Y%m%d%H%M%S')

    if params.has_key('email') and len(params['email']) != 0:
        email = params['email']
    else:
        email = None

    if params.has_key('last_name') and len(params['last_name']) != 0:
        last_name = params['last_name']
    else:
        last_name = None

    if params.has_key('first_name') and len(params['first_name']) != 0:
        first_name = params['first_name']
    else:
        first_name = None

    if params.has_key('display_name') and len(params['display_name']) != 0:
        display_name = params['display_name']
    else:
        display_name = None

    if email is None or len(email) < 5:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Email no cumple'}), 400
    lower_user_mail = email.lower()
    if User.query.filter_by(email=lower_user_mail).first() is not None:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Ya existe este usuario'}), 400
    new_user_db = User(email, password, display_name, first_name, last_name, active, new_user)

    new_user_db.add_role(Role.get_by_name('candidate'))
    db.session.add(new_user_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_user_db.id}), 201


@apiUser.route('/apiUser/allUser', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def user_all():
    user_all = User.query.with_entities(User.id, User.email).all()
    dict_users = [dict(zip(('id', 'nomb'), r)) for r in user_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_users)), 200


@apiUser.route('/apiUser/idUser', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def user_id():
    user_id = request.args.get('id')
    if user_id and user_id.isdigit() and len(user_id) != 0:
        user = User.query.with_entities(User.id, User.email, User.active, User.new_user, User.first_name,
                                        User.last_name, User.display_name).filter(User.id == user_id).first()
        dict_user = dict(zip(('id', 'email', 'active', 'new_user', 'first_name', 'last_name', 'display_name'), user))
        return jsonify(dict(jsonrpc="2.0", result=dict_user)), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))


@apiUser.route('/apiUser/updateMyUser', methods=['PUT'])
@rbac.allow(['candidate', 'admon'], methods=['PUT'])
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

    user_db = getattr(g_data, '_user_obj', None)
    User.query.filter(User.id == user_db.id).update(json_data['params'])
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiUser.route('/apiUser/updateIdUser', methods=['PUT'])
@rbac.allow(['admon'], methods=['PUT'])
def update_user_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        user_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not user_id or not user_id.isdigit() or not len(user_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if User.query.filter(User.id == user_id).first() is not None:
        User.query.filter(User.id == user_id).update(params)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'User does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiUser.route('/apiUser/logout', methods=['PUT', 'OPTIONS'])
@rbac.allow(['candidate', 'admon'], methods=['PUT', 'OPTIONS'])
def logout_user():
    session.clear()
    return jsonify({"jsonrpc": "2.0", "result": True}), 202
