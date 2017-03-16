from flask import Blueprint, jsonify, request

from server import rbac, db
from models import System

apiSystem = Blueprint('apiSystem', __name__)


# Method for App FUEC
@apiSystem.route('/apiSystem/allSystem', methods=['GET'])
@rbac.allow(['admon'], methods=['GET'])
def api_fuec_marcas_all():
    system_all = System.query.first()
    if system_all is None:
        dict_system = dict(name=None
                           , address=None
                           , owner=None
                           , phone=None
                           , email=None
                           , nit_1=None
                           , nit_2=None
                           , logo=None
                           , sign=None
                           )

        db.session.add(System(None, None, None, None, None, None, None, None, None))
        db.session.commit()
    else:
        dict_system = system_all.get_json()
    return jsonify(dict(jsonrpc="2.0", result=dict_system)), 200


@apiSystem.route('/apiSystem/updateSystem', methods=['PUT'])
@rbac.allow(['admon'], methods=['PUT'])
def update_marca_id():
    data = {}
    json_data = request.get_json()

    if not json_data.has_key('params') or len(json_data.get('params')) == 0:
        return jsonify({"jsonrpc": "2.0", "result": False, "error": 'incorrect parameters'}), 400

    params = request.json.get('params')

    if params.has_key('name') and len(params['name']) != 0:
        name = params['name']
        data.update(dict(name=name))
    else:
        name = None

    if params.has_key('address') and len(params['address']) != 0:
        address = params['address']
        data.update(dict(address=address))
    else:
        address = None

    if params.has_key('owner') and len(params['owner']) != 0:
        owner = params['owner']
        data.update(dict(owner=owner))
    else:
        owner = None

    if params.has_key('phone') and params['phone'] > 0:
        phone = params['phone']
        data.update(dict(phone=phone))
    else:
        phone = None

    if params.has_key('email') and len(params['email']) != 0:
        email = params['email']
        data.update(dict(email=email))
    else:
        email = None

    if params.has_key('nit_1') and params['nit_1'] > 0:
        nit_1 = params['nit_1']
        data.update(dict(nit_1=nit_1))
    else:
        nit_1 = None

    if params.has_key('nit_2') and params['nit_2'] > 0:
        nit_2 = params['nit_2']
        data.update(dict(nit_2=nit_2))
    else:
        nit_2 = None

    if params.has_key('secuence_contract') and params['secuence_contract'] > 0:
        secuence_contract = params['secuence_contract']
        data.update(dict(secuence_contract=secuence_contract))
    else:
        secuence_contract = None

    if params.has_key('id_company_legal') and params['id_company_legal'] > 0:
        id_company_legal = params['id_company_legal']
        data.update(dict(id_company_legal=id_company_legal))
    else:
        id_company_legal = None

    if params.has_key('secuence_payroll') and params['secuence_payroll'] > 0:
        secuence_payroll = params['secuence_payroll']
        data.update(dict(secuence_payroll=secuence_payroll))
    else:
        secuence_payroll = None

    if params.has_key('secuence_vehicle') and params['secuence_vehicle'] > 0:
        secuence_vehicle = params['secuence_vehicle']
        data.update(dict(secuence_vehicle=secuence_vehicle))
    else:
        secuence_vehicle = None

    if params.has_key('logo') and params['logo'] != None and len(params['logo']) != 0:
        logo_data = params['logo'].split(',')
        image_dec = logo_data[1].decode('base64')
        type_data = logo_data[0].split(':')[1].split(';')[0]
        if type_data == 'image/png':
            data.update(dict(logo=image_dec))
            logo = image_dec
        else:
            logo = None
    else:
        logo = None

    if params.has_key('sign') and params['sign'] != None and len(params['sign']) != 0:
        sign_data = params['sign'].split(',')
        image_dec = sign_data[1].decode('base64')
        type_data = sign_data[0].split(':')[1].split(';')[0]
        if type_data == 'image/png':
            data.update(dict(sign=image_dec))
            sign = image_dec
        else:
            sign = None
    else:
        sign = None

    systemF = System.query.first()
    if systemF is not None and len(data) > 0:
        systemF.query.update(data)
        db.session.commit()
    elif systemF is None:
        db.session.add(System(name
                              , address
                              , phone
                              , owner
                              , email
                              , nit_1
                              , nit_2
                              , logo
                              , sign
                              , id_company_legal
                              , secuence_contract
                              , secuence_payroll
                              , secuence_vehicle))
        db.session.commit()
    else:
        return jsonify({"jsonrpc": "2.0", "result": False}), 400
    return jsonify({"jsonrpc": "2.0", "result": True}), 200
