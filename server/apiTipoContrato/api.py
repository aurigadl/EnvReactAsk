from server import rbac, db
from flask import Blueprint, jsonify, request
from models import TipoContrato

apiTipoContrato = Blueprint('apiTipoContrato', __name__)


# Method for App FUEC
@apiTipoContrato.route('/apiFuec/allTipoContrato', methods=['GET'])
@rbac.allow(['admon','candidate'], methods=['GET'])
def api_fuec_tipoContrato_all():
    tipo_contrato_all = TipoContrato.query.with_entities(TipoContrato.id, TipoContrato.name).all()
    dict_tipo_contratos = [dict(zip(('id', 'nomb'), r)) for r in tipo_contrato_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_tipo_contratos)), 200


@apiTipoContrato.route('/apiFuec/newTipoContrato', methods=['POST'])
@rbac.allow(['admon','candidate'], methods=['POST'])
def api_fuec_new_tipo_contrato():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('name') and len(params['name']) != 0:
        name = params['name']
    else:
        name = None

    if name is None or len(name) < 2:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Contrato no cumple con los datos basicos'}), 400
    lower_name = name.lower()
    if TipoContrato.query.filter_by(name=lower_name).first() is not None:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Ya existe este item'}), 400
    new_name_db = TipoContrato(name)

    db.session.add(new_name_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_name_db.id}), 201


@apiTipoContrato.route('/apiFuec/updateIdTipoContrato', methods=['PUT'])
@rbac.allow(['admon','candidate'], methods=['PUT'])
def update_tipo_contrato_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        contrato_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not contrato_id or not contrato_id.isdigit() or not len(contrato_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if TipoContrato.query.filter(TipoContrato.id == contrato_id).first() is not None:
        TipoContrato.query.filter(TipoContrato.id == contrato_id).update(params)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Contrato does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiTipoContrato.route('/apiFuec/deleteIdTipoContrato', methods=['DELETE'])
@rbac.allow(['admon','candidate'], methods=['DELETE'])
def delete_tipo_contrato_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        contrato_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not contrato_id or not contrato_id.isdigit() or not len(contrato_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    id_contrato = TipoContrato.query.filter(TipoContrato.id == contrato_id).first()
    if id_contrato is not None:
        db.session.delete(id_contrato)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Contrato does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200