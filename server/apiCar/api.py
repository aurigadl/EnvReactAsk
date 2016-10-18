from flask import Blueprint, request, abort, jsonify

from server import db, rbac
from models import ClassCar, Car

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


@apiCar.route('/apiFuec/newCar', methods=['POST'])
@rbac.allow(['admon', 'candidate'], methods=['POST'])
def new_Car():
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

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

    new_Car_db = Car(license_plate
                     , model
                     , brand
                     , class_car
                     , operation_card)

    db.session.add(new_Car_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_Car_db.id}), 201


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
def user_id():
    Car_id = request.args.get('id')
    if Car_id and Car_id.isdigit() and len(Car_id) != 0:
        CarNew = Car.query.with_entities(Car.license_plate
                                         , Car.model
                                         , Car.brand
                                         , Car.class_car
                                         , Car.operation_card).filter(Car.id == Car_id).first()
        dict_Car = dict(
            zip(('license_plate'
                 , 'model'
                 , 'brand'
                 , 'class_car'
                 , 'operation_card'
                 ), CarNew))
        return jsonify(dict(jsonrpc="2.0", result=dict_Car)), 200
    else:
        return abort(400, jsonify({"jsonrpc": "2.0", "result": False}))