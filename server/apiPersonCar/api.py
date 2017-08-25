import json

from flask import Blueprint, request, jsonify

from server import db, rbac
from models import PersonCar
from server.apiPerson.models import Person
from server.apiModality.models import Modality
apiPersonCar = Blueprint('apiPersonCar', __name__)


@apiPersonCar.route('/apiFuec/idPersonCar', methods=['GET'])
@rbac.allow(['empresa', 'fuec'], methods=['GET'])
def user_id():
    id_car = request.args.get('id')
    dict_all = []

    if id_car and id_car.isdigit() and len(id_car) != 0:
        person_car = PersonCar.query.with_entities(PersonCar.person_car).filter(PersonCar.id_car == id_car).first()
        if person_car is not None:
            person_car = person_car[0]
            for x in json.JSONDecoder().decode(person_car):
                person_id = Person.query.with_entities(Person.id, Person.first_name + ' ' + Person.last_name)\
                    .filter(Person.id == x['person'])\
                    .first()
                modal_id = Modality.query.with_entities(Modality.id, Modality.name)\
                    .filter(Modality.id == x['mod'])\
                    .first()
                dict_all.append(dict(person=dict(zip(('id', 'name'),person_id)), mod=dict(zip(('id', 'name'),modal_id))))
        else:
            dict_all = json.JSONEncoder().encode([dict(mod=dict(id='', name=''), person=dict(id='', name=''))])
        return jsonify(dict(jsonrpc="2.0", result=dict_all)), 200
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400


@apiPersonCar.route('/apiFuec/updatePersonCar', methods=['PUT'])
@rbac.allow(['empresa', 'fuec'], methods=['PUT'])
def update_person_id():
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0 and params['id'].isdigit():
        id_car = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('person_car') and len(params['person_car']) != 0:
        person_car = json.JSONEncoder().encode(params['person_car'])
        data.update(dict(person_car=person_car))
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if PersonCar.query.filter(PersonCar.id_car == id_car).first() is not None:
        PersonCar.query.filter(PersonCar.id_car == id_car).update(data)
    else:
        new_person_car_db = PersonCar(id_car
                                      , person_car)
        db.session.add(new_person_car_db)

    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True}), 200
