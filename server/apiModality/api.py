from flask import Blueprint, jsonify

from server import rbac, db
from models import Modality

apiModality = Blueprint('apiModality', __name__)


# Method for App FUEC
@apiModality.route('/apiFuec/allModality', methods=['GET'])
@rbac.allow(['empresa', 'fuec'], methods=['GET'])
def api_fuec_modality_all():
    modality_all = Modality.query.with_entities(Modality.id, Modality.name).all()
    if not len(modality_all):
        db.session.add(Modality('Conductor'))
        db.session.add(Modality('Contratante'))
        db.session.add(Modality('Supervisor'))
        db.session.add(Modality('Responsable Contrato'))
        db.session.commit()
        modality_all = Modality.query.with_entities(Modality.id, Modality.name).all()
    dict_modality = [dict(zip(('id', 'nomb'), r)) for r in modality_all]
    return jsonify(dict(jsonrpc="2.0", result=dict_modality)), 200
