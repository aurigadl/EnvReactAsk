from flask import Blueprint, jsonify, request, abort
from server import rbac, db, Role, User

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
    user_id = request.args.get('id')
    if user_id and user_id.isdigit() and len(user_id) != 0:
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

        if 'user_id' not in d or 'role_id' not in d or d['user_id'] == 0:
            return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))

        if len(d['role_id']):
            list_role_id = [s for s in d['role_id'] if s.isdigit()]

        user_id = d['user_id']

        roles_obj = User.query.join(Role, User.roles).filter(User.id == user_id).first()
        # if have id user but dont have id_roles all the roles are deleted
        if len(roles_obj.roles) > 0:
            while roles_obj.roles:
                roles_obj.roles.remove(roles_obj.roles[0])
                db.session.commit()

        if len(list_role_id) == 1:
            id_r = list_role_id[0]
            update_user = User.query.filter(User.id == user_id).first()
            update_role = Role.query.filter(Role.id == id_r).first()
            update_user.add_role(update_role)
            db.session.add(update_user)
            db.session.commit()
        elif len(list_role_id) > 1:
            for role_id in list_role_id:
                id_r2 = role_id[0]
                update_user = User.query.filter(User.id == user_id).first()
                update_role = Role.query.filter(Role.id == id_r2).first()
                update_user.add_role(update_role)
                db.session.add(update_user)
                db.session.commit()
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))
    return jsonify({"jsonrpc": "2.0", "result": True}), 200