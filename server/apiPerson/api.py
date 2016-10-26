from datetime import datetime

from flask import Blueprint, request, abort, jsonify

from server import db, rbac
from models import Person, IdType

apiPerson = Blueprint('apiPerson', __name__)


@apiPerson.route('/apiFuec/allIdType', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def api_fuec_IdType_all():
    idType_all = IdType.query.with_entities(IdType.id, IdType.name).all()
    if not len(idType_all):
        db.session.add(IdType('Cedula'))
        db.session.add(IdType('Nit Numero de Identificacion Tributaria'))
        db.session.add(IdType('Pasaporte'))
        db.session.add(IdType('Nuip Numero unico de identificacion personal'))
        db.session.commit()
        idType_all = IdType.query.with_entities(IdType.id, IdType.name).all()
    dict_idtype = [dict(zip(('id', 'nomb'), r)) for r in idType_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_idtype)), 200


@apiPerson.route('/apiFuec/allPerson', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def person_all():
    person_all = Person.query.with_entities(Person.id, Person.first_name + ' ' + Person.last_name).all()
    dict_person_all = [dict(zip(('id', 'nomb', 'last_name'), r)) for r in person_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_person_all)), 200


@apiPerson.route('/apiFuec/newPerson', methods=['POST'])
@rbac.allow(['admon', 'candidate'], methods=['POST'])
def new_person():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('first_name') and len(params['first_name']) != 0:
        first_name = params['first_name']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('type_person') and len(params['type_person']) != 0:
        type_person = params['type_person']
    else:
        type_person = None

    if params.has_key('type_person') and len(params['last_name']) != 0:
        last_name = params['last_name']
    else:
        last_name = None

    if params.has_key('phone') and len(params['phone']) != 0:
        phone = params['phone']
    else:
        phone = None

    if params.has_key('id_number') and len(params['id_number']) != 0:
        id_number = params['id_number']
    else:
        id_number = None

    if params.has_key('id_type') and params['id_type'] > 0:
        id_type = params['id_type']
    else:
        id_type = None

    if params.has_key('license') and len(params['license']) != 0:
        license = params['license']
    else:
        license = None

    if params.has_key('effective_date') and len(params['effective_date']) != 0:
        effective_date = params['effective_date']
    else:
        effective_date = None

    if params.has_key('address') and len(params['address']) != 0:
        address = params['address']
    else:
        address = None

    if params.has_key('email') and (len(params['email']) != 0):
        email = params['email']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if email is None or len(email) < 5:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Email no cumple'}), 400

    new_person_db = Person(type_person
                           , first_name
                           , last_name
                           , email
                           , phone
                           , id_number
                           , id_type
                           , license
                           , effective_date
                           , address)

    db.session.add(new_person_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_person_db.id}), 201


@apiPerson.route('/apiFuec/updateIdPerson', methods=['PUT'])
@rbac.allow(['admon', 'candidate'], methods=['PUT'])
def update_person_id():
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        person_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not person_id or not person_id.isdigit() or not len(person_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('type_person') and len(params['type_person']) != 0:
        data.update(dict(type_person=params['type_person']))

    if params.has_key('first_name') and len(params['first_name']) != 0:
        data.update(dict(first_name=params['first_name']))

    if params.has_key('last_name') and len(params['last_name']) != 0:
        data.update(dict(last_name=params['last_name']))

    if params.has_key('email') and len(params['email']) != 0:
        data.update(dict(email=params['email']))

    if params.has_key('phone') and len(params['phone']) != 0:
        data.update(dict(phone=params['phone']))

    if params.has_key('id_number') and len(params['id_number']) != 0:
        data.update(dict(id_number=params['id_number']))

    if params.has_key('id_type') and len(params['id_type']) != 0:
        data.update(dict(id_type=params['id_type']))

    if params.has_key('license') and len(params['license']) != 0:
        data.update(dict(license=params['license']))

    if params.has_key('effective_date') and len(params['effective_date']) != 0:
        try:
            date_effective = datetime.strptime(params['effective_date'], "%Y-%m-%d")
            data.update(dict(effective_date=date_effective))
        except ValueError:
            return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters date'}), 400
            raise ValueError("Incorrect data format, should be YYYY-MM-DD")

    if params.has_key('address') and len(params['address']) != 0:
        data.update(dict(address=params['address']))

    if Person.query.filter(Person.id == person_id).first() is not None:
        Person.query.filter(Person.id == person_id).update(data)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'User does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiPerson.route('/apiFuec/idPerson', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def user_id():
    person_id = request.args.get('id')
    if person_id and person_id.isdigit() and len(person_id) != 0:
        person = Person.query.with_entities(Person.type_person
                                            , Person.first_name
                                            , Person.last_name
                                            , Person.email
                                            , Person.phone
                                            , Person.id_number
                                            , Person.id_type
                                            , Person.license
                                            , Person.effective_date
                                            , Person.address).filter(Person.id == person_id).first()

        if person[7]:
            lst = list(person)
            lst[7] = person[7].strftime('%Y-%m-%d')
            person = tuple(lst)

        dict_person = dict(
            zip(('first_name'
                 , 'last_name'
                 , 'email'
                 , 'phone'
                 , 'id_number'
                 , 'id_type'
                 , 'license'
                 , 'effective_date'
                 , 'address'
                 ), person))
        return jsonify(dict(jsonrpc="2.0", result=dict_person)), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))


@apiPerson.route('/apiFuec/deleteIdPerson', methods=['DELETE'])
@rbac.allow(['admon', 'candidate'], methods=['DELETE'])
def delete_person_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        person_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not person_id or not person_id.isdigit() or not len(person_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    id_person = Person.query.filter(Person.id == person_id).first()
    if id_person is not None:
        db.session.delete(id_person)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Person does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200
