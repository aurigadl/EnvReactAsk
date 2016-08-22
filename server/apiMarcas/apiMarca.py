from shared.models import rbac
from flask import Blueprint, jsonify
from models import Marca

apiMarca = Blueprint('apiMarca', __name__)

# Method for App FUEC
@apiMarca.route('/apiFuec/allMarcas', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def apiafuec_marcas_all():
    marcas_all = Marca.query.with_entities(Marca.id, Marca.name).all()
    dict_marcas = [dict(zip(('id', 'nomb'), r)) for r in marcas_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_marcas)), 200