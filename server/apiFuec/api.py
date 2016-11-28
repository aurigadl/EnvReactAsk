import json

from flask import Blueprint, jsonify, request

from models import Fuec
from server import rbac, db
from server.apiPerson.models import Person
from server.apiKindAgreement.models import KindAgreement
from server.apiCar.models import Car, ClassCar
from server.apiMarcas.models import Marca
from server.apiPersonCar.models import PersonCar
from server.apiRuta.models import Ruta
from server.apiObjectAgreement.models import ObjectAgreement
from server.libs.calendarTranslate import calendarTranslate as trasCal
from server.pdfTemplate.fuec import TmpPdfFuec

apiFuec = Blueprint('apiFuec', __name__)


# Method for App FUEC
@apiFuec.route('/apiFuec/newFuec', methods=['PUT'])
@rbac.allow(['admon', 'candidate'], methods=['PUT'])
def api_fuec_new():
    json_data = request.get_json()
    data_drivers = []
    contractor_owner = []
    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('no_fuec') and len(params['no_fuec']) != 0:
        no_fuec = params['no_fuec']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('social_object') and len(params['social_object']) != 0:
        social_object = params['social_object']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('nit') and len(params['nit']) != 0:
        nit = params['nit']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('no_agreefuec') and len(params['no_agreefuec']) != 0:
        no_agreefuec = params['no_agreefuec']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('contractor') and len(params['contractor']) != 0:
        contractor = params['contractor']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('agreement_object') and len(params['agreement_object']) != 0:
        agreement_object = params['agreement_object']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('selectRuta') and params['selectRuta'] > 0:
        selectRuta = params['selectRuta']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('kind_agreement') and len(params['kind_agreement']) != 0:
        kind_agreement = params['kind_agreement']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('kind_agreement_link') and len(params['kind_agreement_link']) != 0:
        kind_agreement_link = params['kind_agreement_link']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('init_date') and (len(params['init_date']) != 0):
        init_date = params['init_date']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('last_date') and (len(params['last_date']) != 0):
        last_date = params['last_date']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    if params.has_key('no_car') and (len(params['no_car']) != 0):
        id_car = params['no_car']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    d_contractor = Person.query.with_entities(Person.first_name + ' ' +
                                              Person.last_name
                                              , Person.id_number).filter(Person.id == contractor).first()

    contractor, id_contractor = d_contractor

    object_agreement = ObjectAgreement.query.with_entities(ObjectAgreement.name).filter(
        ObjectAgreement.id == agreement_object).first()[0]

    ruta = json.JSONEncoder().encode(Ruta.query.with_entities(Ruta.name).filter(
        Ruta.id.in_(selectRuta)).all())

    kindAgreement = json.JSONEncoder().encode(KindAgreement.query.with_entities(KindAgreement.id, KindAgreement.name).filter(
        KindAgreement.id == kind_agreement).first())

    kind_agreement_link = json.JSONEncoder().encode(Person.query.with_entities(Person.first_name + ' ' + Person.last_name).filter(
        Person.id == kind_agreement_link).first())

    text_init_date = json.JSONEncoder().encode(trasCal(init_date).translate())
    text_last_date = json.JSONEncoder().encode(trasCal(last_date).translate())

    car = Car.query.join(Marca, ClassCar).with_entities(Marca.name
                                                        , ClassCar.name
                                                        , Car.no_car
                                                        , Car.license_plate
                                                        , Car.model
                                                        , Car.operation_card
                                                        ).filter(Car.brand == Marca.id, Car.id == id_car,
                                                                 Car.class_car == ClassCar.id).first()

    car_brand = car[0]
    car_class_car = car[1]
    car_no = car[2]
    car_license_plate = car[3]
    car_model = car[4]
    car_operation = car[5]

    person_car = PersonCar.query.with_entities(PersonCar.person_car).filter(PersonCar.id_car == id_car).first()

    for r in person_car:
        for rel in json.loads(r):
            d_person = Person.query.with_entities(Person.type_person
                                                  , Person.first_name
                                                  , Person.last_name
                                                  , Person.email
                                                  , Person.phone
                                                  , Person.id_number
                                                  , Person.id_type
                                                  , Person.license
                                                  , Person.effective_date
                                                  , Person.address).filter(Person.id == rel['person']).first()

            if d_person[8]:
                lst = list(d_person)
                lst[8] = d_person[8].strftime("%Y-%m-%d %H:%M:%S")
                d_person = tuple(lst)

            if int(rel['mod']) == 1:
                data_drivers.append(d_person)
            else:
                contractor_owner.append(d_person)

    makeTmp = TmpPdfFuec('Aurigadl')
    makeTmp()

    new_fuec_db = Fuec(no_fuec
                       , social_object
                       , nit
                       , no_agreefuec
                       , contractor
                       , id_contractor
                       , object_agreement
                       , ruta
                       , kindAgreement
                       , kind_agreement_link
                       , text_init_date
                       , text_last_date
                       , car_no
                       , car_license_plate
                       , car_model
                       , car_brand
                       , car_class_car
                       , car_operation
                       , json.JSONEncoder().encode(data_drivers)
                       , json.JSONEncoder().encode(contractor_owner))

    db.session.add(new_fuec_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_fuec_db.id}), 201