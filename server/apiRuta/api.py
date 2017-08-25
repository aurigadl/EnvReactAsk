from flask import Blueprint, jsonify, request

from server import rbac, db
from models import Ruta

apiRuta = Blueprint('apiRuta', __name__)


# Method for App FUEC
@apiRuta.route('/apiFuec/allRuta', methods=['GET'])
@rbac.allow(['empresa', 'fuec'], methods=['GET'])
def api_fuec_rutas_all():
    rutas_all = Ruta.query.with_entities(Ruta.id, Ruta.name).all()
    dict_rutas = [dict(zip(('id', 'nomb'), r)) for r in rutas_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_rutas)), 200


@apiRuta.route('/apiFuec/newRuta', methods=['POST'])
@rbac.allow(['empresa', 'fuec'], methods=['POST'])
def api_fuec_new_ruta():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('name') and len(params['name']) != 0:
        name = params['name']
    else:
        name = None

    if name is None or len(name) < 2:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Ruta no cumple con los datos basicos'}), 400
    lower_name = name.lower()
    if Ruta.query.filter_by(name=lower_name).first() is not None:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Ya existe este item'}), 400
    new_ruta_db = Ruta(name)

    db.session.add(new_ruta_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_ruta_db.id}), 201


@apiRuta.route('/apiFuec/updateIdRuta', methods=['PUT'])
@rbac.allow(['empresa', 'fuec'], methods=['PUT'])
def update_ruta_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        ruta_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not ruta_id or not ruta_id.isdigit() or not len(ruta_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if Ruta.query.filter(Ruta.id == ruta_id).first() is not None:
        Ruta.query.filter(Ruta.id == ruta_id).update(params)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Ruta does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiRuta.route('/apiFuec/deleteIdRuta', methods=['DELETE'])
@rbac.allow(['empresa', 'fuec'], methods=['DELETE'])
def delete_ruta_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        ruta_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not ruta_id or not ruta_id.isdigit() or not len(ruta_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    id_ruta = Ruta.query.filter(Ruta.id == ruta_id).first()
    if id_ruta is not None:
        db.session.delete(id_ruta)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Ruta does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200
