from server import rbac, db
from flask import Blueprint, jsonify, request
from models import KindHiring

apiKindHiring = Blueprint('apiKindHiring', __name__)


# Method for App FUEC
@apiKindHiring.route('/apiFuec/allKindHiring', methods=['GET'])
@rbac.allow(['admon','candidate'], methods=['GET'])
def api_fuec_KindHiring_all():
    tipo_contrato_all = KindHiring.query.with_entities(KindHiring.id, KindHiring.name).all()
    if not len(tipo_contrato_all):
        db.session.add(KindHiring('Convenio'))
        db.session.add(KindHiring('Consorcio'))
        db.session.add(KindHiring('Union Temporal'))
        db.session.commit()
        tipo_contrato_all = KindHiring.query.with_entities(KindHiring.id, KindHiring.name).all()
    dict_tipo_contratos = [dict(zip(('id', 'nomb'), r)) for r in tipo_contrato_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_tipo_contratos)), 200