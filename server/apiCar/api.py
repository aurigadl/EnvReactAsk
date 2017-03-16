from flask import Blueprint, request, abort, jsonify

from server import db, rbac
from models import ClassCar, Car
from server.apiMarcas.models import Marca
from server.apiSystem.models import System
from server.apiPersonCar.models import PersonCar

apiCar = Blueprint('apiCar', __name__)

@apiCar.route('/apiFuec/allClassCar', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def api_fuec_classcar_all():
    classCar_all = ClassCar.query.with_entities(ClassCar.id, ClassCar.name).all()
    if not len(classCar_all):
        db.session.add(ClassCar('Automovil'))
        db.session.add(ClassCar('Camion'))
        db.session.add(ClassCar('Bus'))
        db.session.add(ClassCar('Camioneta'))
        db.session.add(ClassCar('Campero'))
        db.session.commit()
        classCar_all = ClassCar.query.with_entities(ClassCar.id, ClassCar.name).all()
    dict_classcar = [dict(zip(('id', 'nomb'), r)) for r in classCar_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_classcar)), 200


@apiCar.route('/apiFuec/allCar', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def Car_all():
    Car_all = Car.query.with_entities(Car.id, Car.license_plate).all()
    dict_Car_all = [dict(zip(('id', 'nomb'), r)) for r in Car_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_Car_all)), 200


@apiCar.route('/apiFuec/allCarWithPerson', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def Car_with_person_all():
    Car_all = Car.query.join(PersonCar).with_entities(Car.id, Car.license_plate).filter(
        Car.id == PersonCar.id_car).all()
    dict_Car_all = [dict(zip(('id', 'nomb'), r)) for r in Car_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_Car_all)), 200


@apiCar.route('/apiFuec/newCar', methods=['POST'])
@rbac.allow(['admon', 'candidate'], methods=['POST'])
def new_Car():
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    system_all = System.query.first()
    last_car = Car.query.with_entities(Car.no_car).order_by(
        Car.no_car.desc()).first()

    if system_all:
        no_car = system_all.secuence_vehicle + 1
        no_new_car = no_car
    else:
        no_new_car = 1

    if last_car and no_new_car <= last_car[0]:
        no_new_car = last_car[0] + 1

    data.update(dict(secuence_vehicle=no_new_car))
    System.query.first().query.update(data)
    db.session.commit()

    if params.has_key('license_plate') and len(params['license_plate']) != 0:
        license_plate = params['license_plate']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('model') and len(params['model']) != 0:
        model = params['model']
    else:
        model = None

    if params.has_key('brand') and len(params['brand']) != 0:
        brand = params['brand']
    else:
        brand = None

    if params.has_key('class_car') and len(params['class_car']) != 0:
        class_car = params['class_car']
    else:
        class_car = None

    if params.has_key('operation_card') and params['operation_card'] > 0:
        operation_card = params['operation_card']
    else:
        operation_card = None

    new_Car_db = Car(no_new_car
                     , license_plate
                     , model
                     , brand
                     , class_car
                     , operation_card)

    db.session.add(new_Car_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_Car_db.id, "no_car": no_new_car}), 201


@apiCar.route('/apiFuec/updateIdCar', methods=['PUT'])
@rbac.allow(['admon', 'candidate'], methods=['PUT'])
def update_Car_id():
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        Car_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not Car_id or not Car_id.isdigit() or not len(Car_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('license_plate') and len(params['license_plate']) != 0:
        data.update(dict(license_plate=params['license_plate']))

    if params.has_key('model') and len(params['model']) != 0:
        data.update(dict(model=params['model']))

    if params.has_key('email') and len(params['email']) != 0:
        data.update(dict(email=params['email']))

    if params.has_key('brand') and len(params['brand']) != 0:
        data.update(dict(brand=params['brand']))

    if params.has_key('class_car') and len(params['class_car']) != 0:
        data.update(dict(class_car=params['class_car']))

    if params.has_key('operation_card') and len(params['operation_card']) != 0:
        data.update(dict(operation_card=params['operation_card']))

    if Car.query.filter(Car.id == Car_id).first() is not None:
        Car.query.filter(Car.id == Car_id).update(data)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'User does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200


@apiCar.route('/apiFuec/idCar', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def car_id():
    Car_id = request.args.get('id')
    if Car_id and Car_id.isdigit() and len(Car_id) != 0:

        CarNew = Car.query.join(Marca, ClassCar).with_entities(Car.no_car
                                         , Car.license_plate
                                         , Car.model
                                         , Car.brand
                                         , Marca.name
                                         , ClassCar.name
                                         , Car.class_car
                                         , Car.operation_card).filter(Car.brand == Marca.id,
                                                 Car.id == Car_id,
                                                 Car.class_car == ClassCar.id).first()
        dict_Car = dict(
            zip(('no_car'
                 , 'license_plate'
                 , 'model'
                 , 'brand_i'
                 , 'brand_t'
                 , 'class_car_t'
                 , 'class_car_i'
                 , 'operation_card'
                 ), CarNew))
        return jsonify(dict(jsonrpc="2.0", result=dict_Car)), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))


@apiCar.route('/apiFuec/deleteIdCar', methods=['DELETE'])
@rbac.allow(['admon', 'candidate'], methods=['DELETE'])
def delete_car_id():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('id') and len(params['id']) != 0:
        car_id = params['id']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if not car_id or not car_id.isdigit() or not len(car_id) != 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    id_car = Car.query.filter(Car.id == car_id).first()
    if id_car is not None:
        db.session.delete(id_car)
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'Agreement does not exist'}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200
