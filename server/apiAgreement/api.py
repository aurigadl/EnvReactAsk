from datetime import datetime

from flask import Blueprint, request, abort, jsonify

from server import db, rbac
from models import Agreement

apiAgreement = Blueprint('apiAgreement', __name__)


@apiAgreement.route('/apiFuec/allAgreement', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def Agreement_all():
    Agreement_all = Agreement.query.with_entities(Agreement.id, Agreement.no_agreement).all()
    dict_agreement_all = [dict(zip(('id', 'nomb'), r)) for r in Agreement_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_agreement_all)), 200


@apiAgreement.route('/apiFuec/newAgreement', methods=['POST'])
@rbac.allow(['admon', 'candidate'], methods=['POST'])
def new_agreement():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('no_agreement') and len(params['no_agreement']) != 0:
        no_agreement = params['no_agreement']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('no_trip') and len(params['no_trip']) != 0:
        no_trip = params['no_trip']
    else:
        no_trip = None

    if params.has_key('name_contract') and len(params['name_contract']) != 0:
        name_contract = params['name_contract']
    else:
        name_contract = None

    if params.has_key('id_type') and len(params['id_type']) != 0:
        id_type = params['id_type']
    else:
        id_type = None

    if params.has_key('id_number') and len(params['id_number']) != 0:
        id_number = params['id_number']
    else:
        id_number = None

    if params.has_key('nit_1') and len(params['nit_1']) != 0:
        nit_1 = params['nit_1']
    else:
        nit_1 = None

    if params.has_key('nit_2') and params['nit_2'] > 0:
        nit_2 = params['nit_2']
    else:
        nit_2 = None

    if params.has_key('purpose') and len(params['purpose']) != 0:
        purpose = params['purpose']
    else:
        purpose = None

    if params.has_key('id_route') and len(params['id_route']) != 0:
        id_route = params['id_route']
    else:
        id_route = None

    if params.has_key('id_type_agreement') and len(params['id_type_agreement']) != 0:
        id_type_agreement = params['id_type_agreement']
    else:
        id_type_agreement = None

    if params.has_key('init_date') and (len(params['init_date']) != 0):
        init_date = params['init_date']
    else:
        init_date = None

    if params.has_key('last_date') and (len(params['last_date']) != 0):
        last_date = params['last_date']
    else:
        last_date = None

    new_agreement_db = Agreement(no_agreement
                                 , no_trip
                                 , name_contract
                                 , id_type
                                 , id_number
                                 , nit_1
                                 , nit_2
                                 , purpose
                                 , id_route
                                 , id_type_agreement
                                 , init_date
                                 , last_date)

    db.session.add(new_agreement_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_agreement_db.id}), 201


@apiAgreement.route('/apiFuec/updateIdAgreement', methods=['PUT'])
@rbac.allow(['admon', 'candidate'], methods=['PUT'])
def update_agreement_id():
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        agreement_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not agreement_id or not agreement_id.isdigit() or not len(agreement_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('no_agreement') and len(params['no_agreement']) != 0:
        data.update(dict(no_agreement=params['no_agreement']))

    if params.has_key('no_trip') and len(params['no_trip']) != 0:
        data.update(dict(no_trip=params['no_trip']))

    if params.has_key('name_contract') and len(params['name_contract']) != 0:
        data.update(dict(name_contract=params['name_contract']))

    if params.has_key('id_type') and len(params['id_type']) != 0:
        data.update(dict(id_type=params['id_type']))

    if params.has_key('id_number') and len(params['id_number']) != 0:
        data.update(dict(id_type=params['id_number']))

    if params.has_key('nit_2') and len(params['nit_2']) != 0:
        data.update(dict(nit_2=params['nit_2']))

    if params.has_key('nit_1') and len(params['nit_1']) != 0:
        data.update(dict(nit_1=params['nit_1']))

    if params.has_key('purpose') and len(params['purpose']) != 0:
        data.update(dict(purpose=params['purpose']))

    if params.has_key('id_route') and len(params['id_route']) != 0:
        data.update(dict(id_route=params['id_route']))

    if params.has_key('id_type_agreement') and len(params['id_type_agreement']) != 0:
        data.update(dict(id_type_agreement=params['id_type_agreement']))

    if params.has_key('init_date') and len(params['init_date']) != 0:
        try:
            init_date_effective = datetime.strptime(params['init_date'], "%Y-%m-%d")
            data.update(dict(init_date=init_date_effective))
        except ValueError:
            return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters date'}), 400
            raise ValueError("Incorrect data format, should be YYYY-MM-DD")

    if params.has_key('last_date') and len(params['last_date']) != 0:
        try:
            last_date_effective = datetime.strptime(params['last_date'], "%Y-%m-%d")
            data.update(dict(last_date=last_date_effective))
        except ValueError:
            return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters date'}), 400
            raise ValueError("Incorrect data format, should be YYYY-MM-DD")

    if Agreement.query.filter(Agreement.id == agreement_id).first() is not None:
        Agreement.query.filter(Agreement.id == agreement_id).update(data)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'User does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiAgreement.route('/apiFuec/idAgreement', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def user_id():
    agreement_id = request.args.get('id')
    if agreement_id and agreement_id.isdigit() and len(agreement_id) != 0:
        agreement = Agreement.query.with_entities(Agreement.no_agreement
                                                  , Agreement.no_trip
                                                  , Agreement.id_type
                                                  , Agreement.id_number
                                                  , Agreement.nit_1
                                                  , Agreement.nit_2
                                                  , Agreement.purpose
                                                  , Agreement.id_route
                                                  , Agreement.id_type_agreement
                                                  , Agreement.init_date
                                                  , Agreement.last_date).filter(
            Agreement.id == agreement_id).first()

        if agreement[8]:
            lst = list(agreement)
            lst[8] = agreement[8].strftime('%Y-%m-%d')
            agreement = tuple(lst)

        if agreement[9]:
            lst = list(agreement)
            lst[9] = agreement[9].strftime('%Y-%m-%d')
            agreement = tuple(lst)

        dict_agreement = dict(
            zip(('no_agreement'
                 , 'no_trip'
                 , 'id_type'
                 , 'id_number'
                 , 'nit_1'
                 , 'nit_2'
                 , 'purpose'
                 , 'id_route'
                 , 'id_type_agreement'
                 , 'init_date'
                 , 'last_date'), agreement))

        return jsonify(dict(jsonrpc="2.0", result=dict_agreement)), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))


@apiAgreement.route('/apiFuec/deleteIdAgreement', methods=['DELETE'])
@rbac.allow(['admon','candidate'], methods=['DELETE'])
def delete_agreement_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        agreement_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not agreement_id or not agreement_id.isdigit() or not len(agreement_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    id_agreement = Agreement.query.filter(Agreement.id == agreement_id).first()
    if id_agreement is not None:
        db.session.delete(id_agreement)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Agreement does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200