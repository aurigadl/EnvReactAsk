from flask import Blueprint, request, abort, jsonify

from server.apiKindAgreement.models import KindAgreement
from server import db, rbac, g_data, User
from models import Agreement
from server.apiPerson.models import Person
from server.apiObjectAgreement.models import ObjectAgreement

apiAgreement = Blueprint('apiAgreement', __name__)


@apiAgreement.route('/apiFuec/allAgreement', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def Agreement_all():
    Agreement_all = Agreement.query.with_entities(Agreement.id, Agreement.no_agreement).all()
    dict_agreement_all = [dict(zip(('id', 'nomb'), r)) for r in Agreement_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_agreement_all)), 200


@apiAgreement.route('/apiFuec/fileAgreement', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def agreement_file():
    agreement = request.args.get('agreement')

    if not agreement or len(agreement) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    agreement_file = Agreement.query.with_entities(Agreement.file_pdf).filter(
        Agreement.no_agreement == agreement).first()

    if not agreement_file[0]:
        return jsonify(dict(jsonrpc="2.0", result='')), 200

    file_to_send = agreement_file[0].encode("base64")

    return jsonify(dict(jsonrpc="2.0", result=file_to_send)), 200


@apiAgreement.route('/apiFuec/fullAllAgreement', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def full_Agreement_all():
    full_Agreement_all = Agreement.query.join(KindAgreement, User, Person, ObjectAgreement) \
        .with_entities(Agreement.id,
                       Agreement.created_at,
                       User.first_name + ' ' + User.last_name,
                       Agreement.no_agreement,
                       Person.first_name + ' ' + Person.last_name,
                       KindAgreement.name,
                       ObjectAgreement.name
                       ).filter(
        KindAgreement.id == Agreement.id_type_agreement,
        User.id == Agreement.created_by,
        adalias1.id == Agreement.id_person,
        adalias2.id == Agreement.id_person_agreement,
        ObjectAgreement.id == Agreement.id_object_agreement).all()

    dict_agreement_all = [dict(zip(('id',
                                    'created_at',
                                    'created_by',
                                    'no_agreement',
                                    'person',
                                    'KindAgreement',
                                    'person_agrement',
                                    'ObjectAgreement'), r)) for r in full_Agreement_all]

    return jsonify(dict(jsonrpc="2.0", result=dict_agreement_all)), 200


@apiAgreement.route('/apiFuec/newAgreement', methods=['POST'])
@rbac.allow(['admon', 'candidate'], methods=['POST'])
def new_agreement():
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('no_agreement') and len(params['no_agreement']) != 0:
        no_agreement = params['no_agreement']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - no agreement'}), 400

    if params.has_key('id_person') and len(params['id_person']) != 0:
        id_person = params['id_person']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - no person'}), 400

    if params.has_key('id_type_agreement') and len(params['id_type_agreement']) != 0:
        id_type_agreement = params['id_type_agreement']
    else:
        id_type_agreement = None

    if params.has_key('id_person_agreement') and len(params['id_person_agreement']) != 0:
        id_person_agreement = params['id_person_agreement']
    else:
        id_person_agreement = None

    if params.has_key('id_object_agreement') and len(params['id_object_agreement']) != 0:
        id_object_agreement = params['id_object_agreement']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - type agreement'}), 400

    if params.has_key('file_pdf') and params['file_pdf'] != None and len(params['file_pdf']) != 0:
        pdf_data = params['file_pdf'].split(',')
        image_dec = pdf_data[1].decode('base64')
        type_data = pdf_data[0].split(':')[1].split(';')[0]
        if type_data == 'application/pdf':
            pdf_file = image_dec
        else:
            pdf_file = None
    else:
        pdf_file = None

    created_by = g_data._user_obj.id

    new_agreement_db = Agreement(no_agreement
                                 , created_by
                                 , id_person
                                 , id_type_agreement
                                 , id_person_agreement
                                 , id_object_agreement
                                 , pdf_file)

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

    if params.has_key('no_agreement') and len(params['no_agreement']) != 0:
        data.update(dict(no_agreement=params['no_agreement']))

    if params.has_key('id_person') and len(params['id_person']) != 0:
        data.update(dict(id_person=params['id_person']))

    if params.has_key('id_object_agreement') and len(params['id_object_agreement']) != 0:
        data.update(dict(id_object_agreement=params['id_object_agreement']))

    if params.has_key('id_type_agreement') and len(params['id_type_agreement']) != 0:
        data.update(dict(id_type_agreement=params['id_type_agreement']))

    if params.has_key('id_person_agreement') and len(params['id_person_agreement']) != 0:
        data.update(dict(id_person_agreement=params['id_person_agreement']))

    if params.has_key('pdf_file') and params['pdf_file'] != None and len(params['pdf_file']) != 0:
        pdf_data = params['pdf_file'].split(',')
        image_dec = pdf_data[1].decode('base64')
        type_data = pdf_data[0].split(':')[1].split(';')[0]
        if type_data == 'application/pdf':
            data.update(dict(file_pdf=image_dec))

    if Agreement.query.filter(Agreement.id == agreement_id).first() is not None:
        Agreement.query.filter(Agreement.id == agreement_id).update(data)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Agreement does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiAgreement.route('/apiFuec/idAgreement', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def user_id():
    agreem = {}
    agreement_id = request.args.get('id')
    if agreement_id and agreement_id.isdigit() and len(agreement_id) != 0:
        agreement = Agreement.query.join(ObjectAgreement, User) \
            .with_entities(Agreement.no_agreement
                           , Agreement.created_at
                           , Agreement.created_by
                           , User.first_name + ' ' + User.last_name
                           , Agreement.id_person
                           , Agreement.id_object_agreement
                           , ObjectAgreement.name
                           , Agreement.id_type_agreement
                           , Agreement.id_person_agreement
                           , Agreement.file_pdf) \
            .filter(
            Agreement.id == agreement_id,
            User.id == Agreement.created_by,
            ObjectAgreement.id == Agreement.id_object_agreement
        ).first()

        agreem['no_agreement'] = agreement[0]
        agreem['created_at'] = agreement[1]
        agreem['id_created_by'] = agreement[2]
        agreem['name_created_by'] = agreement[3]
        agreem['id_person'] = agreement[4]

        person_sql = Person.query.with_entities(Person.first_name, Person.last_name) \
            .filter(Person.id == agreement[4]).first()
        agreem['name_person'] = person_sql[0] + ' ' + person_sql[1]

        agreem['id_object_agreement'] = agreement[5]
        agreem['name_object_agreement'] = agreement[6]

        if agreement[7]:
            kindAgreement_sql = KindAgreement.query.with_entities(KindAgreement.name) \
                .filter(KindAgreement.id == agreement[7]).first()
            agreem['name_type_agreement'] = kindAgreement_sql[0]
            agreem['id_type_agreement'] = agreement[7]
        else:
            agreem['name_type_agreement'] = None
            agreem['id_type_agreement'] = None

        if agreement[8]:
            person_a_sql = Person.query.with_entities(Person.first_name, Person.last_name) \
                .filter(Person.id == agreement[8]).first()
            agreem['name_person_agreement'] = person_a_sql[0] + ' ' + person_a_sql[1]
            agreem['id_person_agreement'] = agreement[8]
        else:
            agreem['id_person_agreement'] = None
            agreem['name_person_agreement'] = None

        if agreement[9]:
            agreem['file_pdf'] = agreement[9].encode("base64")
        else:
            agreem['file_pdf'] = None

        return jsonify(dict(jsonrpc="2.0", result=agreem)), 200

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
