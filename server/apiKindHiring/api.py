from server import rbac, db
from flask import Blueprint, jsonify, request
from models import KindHiring

apiKindHiring = Blueprint('apiKindHiring', __name__)


# Method for App FUEC
@apiKindHiring.route('/apiFuec/allKindHiring', methods=['GET'])
@rbac.allow(['admon','candidate'], methods=['GET'])
def api_fuec_KindHiring_all():
    kind_agreement_all = KindHiring.query.with_entities(KindHiring.id, KindHiring.name).all()
    if not len(kind_agreement_all):
        db.session.add(KindHiring('Vinculacion'))
        db.session.add(KindHiring('Administracion de Flota'))
        db.session.add(KindHiring('Servicios de Transporte'))
        db.session.commit()
        kind_agreement_all = KindHiring.query.with_entities(KindHiring.id, KindHiring.name).all()
    dict_kind_hiring = [dict(zip(('id', 'nomb'), r)) for r in kind_agreement_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_kind_hiring)), 200