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
    dict_idtype = [dict(zip(('id', 'name'), r)) for r in idType_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_idtype)), 200


@apiPerson.route('/apiFuec/allPerson', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def person_all():
    person_all = Person.query.with_entities(Person.id, Person.first_name, Person.last_name).all()
    dict_users = [dict(zip(('id', 'name', 'last_name'), r)) for r in person_all]
    return jsonify(dict(jsonrpc="2.0", result=person_all)), 200


@apiPerson.route('/apiFuec/newPerson', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def new_person():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('first_name') and len(params['first_name']) != 0:
        first_name = params['first_name']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('last_name') and len(params['last_name']) != 0:
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

    if params.has_key('email') and (len(params['email']) != 0 ):
        email = params['email']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if email is None or len(email) < 5:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Email no cumple'}), 400

    new_person_db = Person(first_name
                           ,last_name
                           ,email
                           ,phone
                           ,id_number
                           ,id_type
                           ,license
                           ,effective_date
                           ,address)

    db.session.add(new_person_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_person_db.id}), 201
