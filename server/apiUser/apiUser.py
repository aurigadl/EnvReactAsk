from shared.models import db, rbac, g_data
from flask import Blueprint, request, abort, jsonify, session
from models import Role, User
from datetime import datetime, timedelta
import jwt
import config

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


@apiUser.route('/apiUser/newuser', methods=['POST'])
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
        user = User.query.with_entities(User.id, User.email, User.active, User.new_user, User.first_name, User.last_name).filter(User.id == user_id ).first()
        dict_user = dict(zip(('id', 'email', 'active', 'new_user', 'first_name', 'last_name'), user))
        return jsonify(dict(jsonrpc="2.0", result=dict_user)), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))


@apiUser.route('/apiUser/updateUser', methods=['PUT'])
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


@apiUser.route('/apiUser/logout', methods=['PUT', 'OPTIONS'])
@rbac.allow(['candidate', 'admon'], methods=['PUT', 'OPTIONS'])
def logout_user():
    session.clear()
    return jsonify({"jsonrpc": "2.0", "result": True}), 202