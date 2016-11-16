from server import rbac, db
from flask import Blueprint, jsonify, request
from models import KindAgreement

apiKindAgreement = Blueprint('apiKindAgreement', __name__)


# Method for App FUEC
@apiKindAgreement.route('/apiFuec/allKindAgreement', methods=['GET'])
@rbac.allow(['admon','candidate'], methods=['GET'])
def api_KindAgreement_all():
    Kind_agreement_all = KindAgreement.query.with_entities(KindAgreement.id, KindAgreement.name).all()
    if not len(Kind_agreement_all):
        db.session.add(KindAgreement('Union Temporal'))
        db.session.add(KindAgreement('Convenio'))
        db.session.commit()
        Kind_agreement_all = KindAgreement.query.with_entities(KindAgreement.id, KindAgreement.name).all()
    dict_Kind_agreement = [dict(zip(('id', 'nomb'), r)) for r in Kind_agreement_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_Kind_agreement)), 200