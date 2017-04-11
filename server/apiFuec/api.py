import json
import os
import random

from flask import Blueprint, jsonify, request

from models import Fuec
from server import db, rbac, g_data, User
from server.apiPerson.models import Person
from server.apiKindAgreement.models import KindAgreement
from server.apiCar.models import Car, ClassCar
from server.apiMarcas.models import Marca
from server.apiPersonCar.models import PersonCar
from server.apiRuta.models import Ruta
from server.apiObjectAgreement.models import ObjectAgreement
from server.libs.calendarTranslate import calendarTranslate as trasCal
from server.pdfTemplate.fuec import TmpPdfFuec
from server.apiAgreement.models import Agreement
from server.apiSystem.models import System
from server.apiModality.models import Modality

apiFuec = Blueprint('apiFuec', __name__)


# Method for App FUEC
@apiFuec.route('/apiFuec/newFuec', methods=['PUT'])
@rbac.allow(['admon', 'candidate'], methods=['PUT'])
def api_fuec_new():
    json_data = request.get_json()
    data_drivers = []
    person_car_mod = []

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('route') and len(params['route']) != 0:
        route = params['route']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - route'}), 400

    if params.has_key('date') and params['date'] > 0:
        date = params['date']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - date'}), 400

    if params.has_key('car') and (len(params['car']) != 0):
        car_id = params['car']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - car'}), 400

    if params.has_key('agreement') and (len(params['agreement']) != 0):
        agreement = params['agreement']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - agreement'}), 400

    person_car = PersonCar.query.with_entities(PersonCar.person_car).filter(PersonCar.id_car == car_id).first()

    if person_car is None:
        return jsonify(
            {"jsonrpc": "2.0", "result": False, "error": 'No existen relacion entre personas y el vehiculo'}), 400
    else:
        person_car = person_car[0]
        for x in json.JSONDecoder().decode(person_car):
            person_id = Person.query.with_entities(Person.id, Person.first_name + ' ' + Person.last_name) \
                .filter(Person.id == x['person']) \
                .first()
            modal_id = Modality.query.with_entities(Modality.id, Modality.name) \
                .filter(Modality.id == x['mod']) \
                .first()
            person_car_mod.append(
                dict(person=dict(zip(('id', 'name'), person_id)), mod=dict(zip(('id', 'name'), modal_id))))

    agreement = Agreement.query.join(KindAgreement, ObjectAgreement, User, Person) \
        .with_entities(Agreement.no_agreement
                       , Agreement.created_at
                       , Agreement.created_by
                       , User.first_name + ' ' + User.last_name
                       , Agreement.id_person
                       , Person.first_name + ' ' + Person.last_name
                       , Agreement.id_type_agreement
                       , KindAgreement.name
                       , Agreement.id_object_agreement
                       , ObjectAgreement.name
                       , Agreement.file_pdf) \
        .filter(
        Agreement.id == agreement,
        KindAgreement.id == Agreement.id_type_agreement,
        ObjectAgreement.id == Agreement.id_object_agreement,
        User.id == Agreement.created_by,
        Person.id == Agreement.id_person
    ).first()

    if agreement[10]:
        lst = list(agreement)
        lst[10] = agreement[10].encode("base64")
        agreement = tuple(lst)

    dict_agreement = dict(
        zip(('no_agreement'
             , 'created_at'
             , 'id_created_by'
             , 'name_created_by'
             , 'id_person'
             , 'name_person'
             , 'id_type_agreement'
             , 'name_type_agreement'
             , 'id_object_agreement'
             , 'name_objectAgreement'
             , 'file_pdf'), agreement))

    ruta = Ruta.query.with_entities(Ruta.name).filter(
        Ruta.id.in_(route)).all()

    text_init_date = trasCal(date[0]).translate()
    text_last_date = trasCal(date[1]).translate()

    car = Car.query.join(Marca, ClassCar).with_entities(Marca.name
                                                        , ClassCar.name
                                                        , Car.no_car
                                                        , Car.license_plate
                                                        , Car.model
                                                        , Car.operation_card
                                                        ).filter(Car.brand == Marca.id, Car.id == car_id,
                                                                 Car.class_car == ClassCar.id).first()

    car_brand = car[0]
    car_class_car = str(car[1])
    car_no = str(car[2])
    car_license_plate = str(car[3])
    car_model = str(car[4])
    car_operation = str(car[5])

    for rel in json.loads(person_car):
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

    if int(rel['mod']) != 1:
        contractor_owner = d_person

    if data_drivers is None:
        return jsonify(
            {"jsonrpc": "2.0", "result": False, "error": 'No existen relacion entre vehiculo y un conductor'}), 400

    system_all = System.query.first()
    nameCompany = system_all.get_json()['name']
    companyLogo = system_all.get_json()['logo']
    nit1 = system_all.get_json()['nit_1']
    nit2 = system_all.get_json()['nit_2']
    contractor = dict_agreement['name_person']
    id_contractor = dict_agreement['id_person']
    kindAgreement =  dict_agreement[name_type_agreement]
    object_agreement = dict_agreement['name_objectAgreement']
    id_fuec = system_all.get_json()['id_company_legal']
    id_payroll = system_all.get_json()['secuence_payroll']
    data_logo = companyLogo.split(',')[1].decode('base64')
    tmp_companyLogo = 'server/tmp/' + str(int(random.random() * 1000000)) + '.png'
    fcl = open(tmp_companyLogo, 'wb')
    fcl.write(data_logo)
    fcl.close()


    no_agreefuec = agreement[0]
    no_fuec = id_fuec + no_agreefuec + id_payroll
    nit = str(nit1) + '-' + str(nit2)

    img_sign = system_all.get_json()['sign']
    data_sign = img_sign.split(',')[1].decode('base64')
    tmp_img_sign = 'server/tmp/' + str(int(random.random() * 1000000)) + '.png'
    fcs = open(tmp_img_sign, 'wb')
    fcs.write(data_sign)
    fcs.close()

    makeTmp = TmpPdfFuec(tmp_companyLogo,
                         no_fuec,
                         nameCompany,
                         nit,
                         no_agreefuec,
                         contractor,
                         id_contractor,
                         object_agreement,
                         ruta,
                         kindAgreement,
                         kind_agreement_link,
                         text_init_date,
                         text_last_date,
                         car_no,
                         car_license_plate,
                         car_model,
                         car_brand,
                         car_class_car,
                         car_operation,
                         data_drivers,
                         contractor_owner,
                         tmp_img_sign)

    file_pdf = makeTmp()

    os.remove(tmp_companyLogo)
    os.remove(tmp_img_sign)

    created_by = g_data._user_obj.id

    new_fuec_db = Fuec(no_fuec
                       , created_by
                       , nameCompany
                       , nit
                       , no_agreefuec
                       , contractor
                       , id_contractor
                       , object_agreement
                       , json.JSONEncoder().encode(ruta)
                       , json.JSONEncoder().encode(kindAgreement)
                       , kind_agreement_link
                       , json.JSONEncoder().encode(text_init_date)
                       , json.JSONEncoder().encode(text_last_date)
                       , car_no
                       , car_license_plate
                       , car_model
                       , car_brand
                       , car_class_car
                       , car_operation
                       , json.JSONEncoder().encode(data_drivers)
                       , json.JSONEncoder().encode(contractor_owner)
                       , file_pdf)

    db.session.add(new_fuec_db)
    db.session.commit()
    return jsonify({"jsonrpc": "2.0", "result": True, "id": new_fuec_db.id}), 201


@apiFuec.route('/apiFuec/fullAllFuec', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def full_fuec_all():
    full_fuec_all = Fuec.query.join(User).with_entities(
        Fuec.id
        , Fuec.created_at
        , User.first_name + ' ' + User.last_name
        , Fuec.no_fuec
        , Fuec.social_object
        , Fuec.nit
        , Fuec.no_agreement
        , Fuec.contractor
        , Fuec.id_contractor
        , Fuec.object_agreement
        , Fuec.origin_destination
        , Fuec.kind_hiring
        , Fuec.kind_link

        , Fuec.init_date
        , Fuec.last_date

        , Fuec.car_no
        , Fuec.car_license_plate
        , Fuec.car_model
        , Fuec.car_brand
        , Fuec.car_class_car
        , Fuec.car_operation

        , Fuec.data_driver_json
        , Fuec.contractor_owner
    ).filter(User.id == Fuec.created_by).all()

    dict_agreement_all = [dict(zip((
        'id'
        , 'created_at'
        , 'created_by'
        , 'no_fuec'
        , 'social_object'
        , 'nit'
        , 'no_agreement'
        , 'contractor'
        , 'id_contractor'
        , 'object_agreement'
        , 'origin_destination'
        , 'kind_hiring'
        , 'kind_link'

        , 'init_date'
        , 'last_date'

        , 'car_no'
        , 'car_license_plate'
        , 'car_model'
        , 'car_brand'
        , 'car_class_car'
        , 'car_operation'

        , 'data_driver_json'
        , 'contractor_owner'), r)) for r in full_fuec_all]

    return jsonify(dict(jsonrpc="2.0", result=dict_agreement_all)), 200


@apiFuec.route('/apiFuec/fileFuec', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def fuec_file():
    fuec = request.args.get('fuec')

    if not fuec or len(fuec) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    fuec_file = Fuec.query.with_entities(Fuec.file_pdf).filter(
        Fuec.id == fuec).first()

    if not fuec_file[0]:
        return jsonify(dict(jsonrpc="2.0", result='')), 200

    file_to_send = fuec_file[0].encode("base64")

    return jsonify(dict(jsonrpc="2.0", result=file_to_send)), 200
