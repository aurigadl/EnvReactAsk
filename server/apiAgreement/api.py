from datetime import datetime

from flask import Blueprint, request, abort, jsonify

from server import db, rbac
from models import Agreement
from server.apiSystem.models import System

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
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    system_all = System.query.first()
    last_agreement = Agreement.query.with_entities(Agreement.no_agreement).order_by(
        Agreement.no_agreement.desc()).first()

    if system_all:
        no_agreement = system_all.secuence_contract + 1
        no_new_agreement = no_agreement
    else:
        no_new_agreement = 1

    if last_agreement and no_new_agreement <= last_agreement[0]:
        no_new_agreement = last_agreement[0] + 1

    data.update(dict(secuence_contract=no_new_agreement))
    System.query.first().query.update(data)
    db.session.commit()

    if params.has_key('no_trip') and len(params['no_trip']) != 0:
        no_trip = params['no_trip']
    else:
        no_trip = None

    if params.has_key('id_person') and len(params['id_person']) != 0:
        id_person = params['id_person']
    else:
        id_person = None

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

    new_agreement_db = Agreement(no_new_agreement
                                 , no_trip
                                 , id_person
                                 , purpose
                                 , id_route
                                 , id_type_agreement
                                 , init_date
                                 , last_date)

    db.session.add(new_agreement_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "no_agreement": new_agreement_db.no_agreement}), 201


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

    if params.has_key('id_number') and len(params['id_person']) != 0:
        data.update(dict(id_type=params['id_person']))

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
                                                  , Agreement.id_person
                                                  , Agreement.purpose
                                                  , Agreement.id_route
                                                  , Agreement.id_type_agreement
                                                  , Agreement.init_date
                                                  , Agreement.last_date).filter(
            Agreement.id == agreement_id).first()

        if agreement[10]:
            lst = list(agreement)
            lst[10] = agreement[10].strftime('%Y-%m-%d')
            agreement = tuple(lst)

        if agreement[11]:
            lst = list(agreement)
            lst[11] = agreement[11].strftime('%Y-%m-%d')
            agreement = tuple(lst)

        dict_agreement = dict(
            zip(('no_agreement'
                 , 'no_trip'
                 , 'id_person'
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
@rbac.allow(['admon', 'candidate'], methods=['DELETE'])
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
