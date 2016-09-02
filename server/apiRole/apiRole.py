from flask import Blueprint, jsonify, request, abort

from shared.models import rbac, db
from apiUser.models import Role, User

apiRole = Blueprint('apiRole', __name__)


@apiRole.route('/apiAdmin/allRoles', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def api_admin_roles_all():
    roles_all = Role.query.with_entities(Role.id, Role.name, Role.description).all()
    dict_roles = [dict(zip(('id', 'nomb', 'description'), r)) for r in roles_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_roles)), 200


@apiRole.route('/apiAdmin/allUserRole', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def api_admin_user_roles_all():
    roles_user_all = User.query.with_entities(Role.id, Role.name, User.id, User.email).join(Role, User.roles).all()
    dict_roles = [dict(zip(('role_id', 'role_name', 'user_id', 'user_name'), r)) for r in roles_user_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_roles)), 200


@apiRole.route('/apiAdmin/idUserRole', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def api_admin_user_roles_id():
    json_data = request.get_json()

    if json_data.has_key('params') and 'items' in dir(json_data.get('params')):
        value_data = json_data.get('params').items()
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
    d = {}
    if len(value_data) != 0:
        for key, value in value_data:
            d[key] = value
        if len(d) == 0 or 'id' not in d:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
        user_id = d['id']
        roles_user = User.query.with_entities(Role.id, Role.name).join(Role, User.roles).filter(User.id == user_id).all()
        dict_roles = [dict(zip(('role_id', 'role_name'), r)) for r in roles_user]
        return jsonify(dict(jsonrpc="2.0", result=dict_roles)), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))


@apiRole.route('/apiAdmin/setUserRole', methods=['PUT'])
@rbac.allow(['admon'], methods=['PUT'])
def api_admin_user_roles_update():
    json_data = request.get_json()
    value_data = json_data.get('params').items()
    d = {}
    if json_data.has_key('params') and len(value_data) != 0:
        for key, value in value_data:
            d[key] = value
        if len(d) == 0 or 'user_id' not in d or 'role_id' not in d:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
        user_id = d['user_id']
        list_role_id = [s for s in d['role_id'] if s.isdigit()]
        if len(list_role_id) == 0:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))

        if 1 == len(list_role_id):
            id_r = list_role_id[0]
            if not User.query.join(Role, User.roles).filter(User.id == user_id, Role.id == id_r).count():
                update_user = User.query.filter(User.id == user_id).first()
                update_role = Role.query.filter(Role.id == id_r).first()
                update_user.add_role(update_role)
                db.session.add(update_user)
                db.session.commit()
        else:
            for role_id in list_role_id:
                id_r2 = role_id[0]
                if not User.query.join(Role, User.roles).filter(User.id == user_id, Role.id == id_r2).count():
                    update_user = User.query.filter(User.id == user_id).first()
                    update_role = Role.query.filter(Role.id == id_r2).first()
                    update_user.add_role(update_role)
                    db.session.add(update_user)
                    db.session.commit()
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiRole.route('/apiAdmin/delUserRole', methods=['DELETE'])
@rbac.allow(['admon'], methods=['DELETE'])
def api_admin_user_roles_delete():
    json_data = request.get_json()
    if json_data.has_key('params') and 'items' in dir(json_data.get('params')):
        value_data = json_data.get('params').items()
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
    d = {}
    if len(value_data) != 0:
        for key, value in value_data:
            d[key] = value
        if len(d) == 0 or 'user_id' not in d or 'role_id' not in d:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
        user_id = d['user_id']
        list_role_id = [s for s in d['role_id'] if s.isdigit()]
        if len(list_role_id) == 0:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))

        if 1 == len(list_role_id):
            id_r = list_role_id[0]
            if User.query.join(Role, User.roles).filter(User.id == user_id, Role.id == id_r).count():
                if User.query.join(Role, User.roles).filter(User.id == user_id, Role.id == id_r).count():
                    db.session.delete(
                        User.query.join(Role, User.roles).filter(User.id == user_id, Role.id == id_r).first())
                    db.session.commit()
        else:
            for role_id in list_role_id:
                id_r2 = role_id[0]
                if User.query.join(Role, User.roles).filter(User.id == user_id, Role.id == id_r2).count():
                    db.session.delete(
                        User.query.join(Role, User.roles).filter(User.id == user_id, Role.id == id_r2).first())
                    db.session.commit()
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
    return jsonify({"jsonrpc": "2.0", "result": True}), 200
