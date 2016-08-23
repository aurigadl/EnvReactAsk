from shared.models import rbac, db
from flask import Blueprint, jsonify, request, abort
from apiUser.models import Role, User

apiRole = Blueprint('apiRole', __name__)


@apiRole.route('/apiAdmin/allRoles', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def apiadmin_roles_all():
    roles_all = Role.query.with_entities(Role.id, Role.name, Role.description).all()
    dict_roles = [dict(zip(('id', 'nomb', 'description'), r)) for r in roles_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_roles)), 200


@apiRole.route('/apiAdmin/allUserRole', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def apiadmin_user_roles_all():
    roles_user_all = User.query.with_entities(Role.id, Role.name, User.id, User.email).join(Role, User.roles).all()
    dict_roles = [dict(zip(('role_id', 'role_name', 'user_id', 'user_name'), r)) for r in roles_user_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_roles)), 200


@apiRole.route('/apiAdmin/setUserRole', methods=['PUT'])
@rbac.allow(['admon'], methods=['PUT'])
def apiadmin_user_roles_update():
    json_data = request.get_json()
    value_data = json_data.get('params').items()
    if json_data.has_key('params') and len(json_data.get('params')) != 0:
        for key, value in value_data:
            if not value.isdigit():
                del json_data['params'][key]
            json_data['params'][key]
        if len(json_data.get('params')) == 0:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
        update_user = User.query.filter(User.id == value_data['user_id']).first()
        update_role = Role.query.filter(Role.id == value_data['role_id']).first()
        update_user.add_role(update_role)
        db.session.commit(update_user)
        return jsonify({"jsonrpc": "2.0", "result": True}), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))