from flask import Blueprint, jsonify

from server import rbac, db
from models import ObjectAgreement

apiObjectAgreement = Blueprint('apiObjectAgreement', __name__)


# Method for App FUEC
@apiObjectAgreement.route('/apiFuec/allObjectAgreement', methods=['GET'])
@rbac.allow(['admon', 'candidate'], methods=['GET'])
def api_fuec_apiObjectAgreement():
    apiObjectAgreement = ObjectAgreement.query.with_entities(ObjectAgreement.id, ObjectAgreement.name).all()
    if not len(apiObjectAgreement):
        db.session.add(ObjectAgreement('Transporte de personas'))
        db.session.add(ObjectAgreement('Envio de encomiendas'))
        db.session.commit()
        apiObjectAgreement = ObjectAgreement.query.with_entities(ObjectAgreement.id, ObjectAgreement.name).all()
    dict_modality = [dict(zip(('id', 'nomb'), r)) for r in apiObjectAgreement]
    return jsonify(dict(jsonrpc="2.0", result=dict_modality)), 200