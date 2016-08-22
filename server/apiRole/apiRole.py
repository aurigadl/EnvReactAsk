from shared.models import rbac
from flask import Blueprint, jsonify
from apiUser.models import Role

apiRole = Blueprint('apiRole', __name__)


@apiRole.route('/apiAdmin/allRoles', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def apiadmin_roles_all():
    roles_all = Role.query.with_entities(Role.id, Role.name, Role.description).all()
    dict_roles = [dict(zip(('id', 'nomb', 'description'), r)) for r in roles_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_roles)), 200