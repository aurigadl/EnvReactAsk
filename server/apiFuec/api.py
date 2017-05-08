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
    agreem = {}

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('route') and len(params['route']) != 0:
        route = params['route']
    else:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters - route'}), 400

    if params.has_key('date'):
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
            {"jsonrpc": "2.0", "result": False, "error": 'Does not exist car and person'}), 400
    else:
        person_car = person_car[0]
        for x in json.JSONDecoder().decode(person_car):
            person_id = Person.query.with_entities(Person.type_person
                                                   , Person.first_name
                                                   , Person.last_name
                                                   , Person.email
                                                   , Person.phone
                                                   , Person.id_number
                                                   , Person.id_type
                                                   , Person.license
                                                   , Person.effective_date
                                                   , Person.address).filter(Person.id == x['person']).first()

            if person_id[8]:
                lst = list(person_id)
                lst[8] = person_id[8].strftime("%Y-%m-%d %H:%M:%S")
                person_id = tuple(lst)

            if int(x['mod']) == 1:
                data_drivers.append(person_id)
            else:
                contractor_owner = person_id

            modal_id = Modality.query.with_entities(Modality.id, Modality.name) \
                .filter(Modality.id == x['mod']) \
                .first()

            person_car_mod.append(
                dict(person=dict(zip(('id', 'name'), person_id)), mod=dict(zip(('id', 'name'), modal_id))))

    agreement = Agreement.query.join(ObjectAgreement, User) \
        .with_entities(Agreement.no_agreement
                       , Agreement.created_at
                       , Agreement.created_by
                       , User.first_name + ' ' + User.last_name
                       , Agreement.id_person
                       , Agreement.id_object_agreement
                       , ObjectAgreement.name
                       , Agreement.id_type_agreement
                       , Agreement.id_person_agreement) \
        .filter(
        Agreement.id == agreement,
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
    contractor = person_sql[0] + ' ' + person_sql[1]

    agreem['id_object_agreement'] = agreement[5]
    object_agreement = agreement[6]

    if agreement[7]:
        kindAgreement_sql = KindAgreement.query.with_entities(KindAgreement.name) \
            .filter(KindAgreement.id == agreement[7]).first()
        kindAgreement = kindAgreement_sql[0]
        agreem['id_type_agreement'] = agreement[7]
    else:
        kindAgreement = None
        agreem['id_type_agreement'] = None

    if agreement[8]:
        person_a_sql = Person.query.with_entities(Person.first_name, Person.last_name) \
            .filter(Person.id == agreement[8]).first()
        name_person_agreement = person_a_sql[0] + ' ' + person_a_sql[1]
        kind_agreement_link = agreement[8]
    else:
        name_person_agreement = None
        kind_agreement_link = None

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

    system_all = System.query.first()
    nameCompany = system_all.get_json()['name']
    companyLogo = system_all.get_json()['logo']
    id_payroll = system_all.get_json()['secuence_payroll']
    id_contractor = str(agreem['id_person'])

    # tmp_company_log
    data_logo = companyLogo.split(',')[1].decode('base64')
    tmp_companyLogo = 'server/tmp/' + str(int(random.random() * 1000000)) + '.png'
    fcl = open(tmp_companyLogo, 'wb')
    fcl.write(data_logo)
    fcl.close()

    # no_agreefuec
    no_agreefuec = str(agreement[0])

    # no_fuec
    id_fuec = str(system_all.get_json()['id_company_legal'])
    no_fuec = id_fuec + no_agreefuec + str(id_payroll + 1)

    # nit
    nit1 = system_all.get_json()['nit_1']
    nit2 = system_all.get_json()['nit_2']
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
                         name_person_agreement,
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

    System.query.first().query.update(dict(secuence_payroll=(id_payroll + 1)))
    db.session.commit()

    os.remove(tmp_companyLogo)
    os.remove(tmp_img_sign)

    return jsonify({"jsonrpc": "2.0", "result": {"id": new_fuec_db.id,
                                                 "file_pdf": file_pdf.encode("base64"),
                                                 "no_fuec":no_fuec
                                                }}), 201


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
