from server import rbac, db
from flask import Blueprint, jsonify, request
from models import Marca

apiMarca = Blueprint('apiMarca', __name__)


# Method for App FUEC
@apiMarca.route('/apiFuec/allMarca', methods=['GET'])
@rbac.allow(['empresa', 'fuec'], methods=['GET'])
def api_fuec_marcas_all():
    marcas_all = Marca.query.with_entities(Marca.id, Marca.name).all()
    dict_marcas = [dict(zip(('id', 'nomb'), r)) for r in marcas_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_marcas)), 200


@apiMarca.route('/apiFuec/newMarca', methods=['POST'])
@rbac.allow(['empresa', 'fuec'], methods=['POST'])
def api_fuec_new_marca():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('marca') and len(params['marca']) != 0:
        marca = params['marca']
    else:
        marca = None

    if marca is None or len(marca) < 2:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Marca no cumple con los datos basicos'}), 400
    lower_marca = marca.lower()
    if Marca.query.filter_by(name=lower_marca).first() is not None:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Ya existe este item'}), 400
    new_marca_db = Marca(marca)

    db.session.add(new_marca_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_marca_db.id}), 201


@apiMarca.route('/apiFuec/updateIdMarca', methods=['PUT'])
@rbac.allow(['empresa', 'fuec'], methods=['PUT'])
def update_marca_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        marca_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not marca_id or not marca_id.isdigit() or not len(marca_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if Marca.query.filter(Marca.id == marca_id).first() is not None:
        Marca.query.filter(Marca.id == marca_id).update(params)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Marca does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiMarca.route('/apiFuec/deleteIdMarca', methods=['DELETE'])
@rbac.allow(['empresa', 'fuec'], methods=['DELETE'])
def delete_marca_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        marca_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not marca_id or not marca_id.isdigit() or not len(marca_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    id_marca = Marca.query.filter(Marca.id == marca_id).first()
    if id_marca is not None:
        db.session.delete(id_marca)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Marca does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200
