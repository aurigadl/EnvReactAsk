from datetime import datetime
from server import db


class Agreement(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'agreement'
    id = db.Column(db.Integer, primary_key=True)
    no_agreement = db.Column(db.Integer, nullable=False, unique=True)
    no_trip = db.Column(db.Integer, nullable=False)
    id_person = db.Column(db.Integer, db.ForeignKey('person.id'))
    purpose = db.Column(db.String(255))
    id_route = db.Column(db.Integer, db.ForeignKey('ruta.id'))
    id_type_agreement = db.Column(db.Integer, db.ForeignKey('kind_hiring.id'))
    init_date = db.Column(db.DateTime())
    last_date = db.Column(db.DateTime())

    def __init__(self,
                 no_agreement=None,
                 no_trip=None,
                 name_contract=None,
                 id_person=None,
                 purpose=None,
                 id_route=None,
                 id_type_agreement=None,
                 init_date=None,
                 last_date=None):

        if no_agreement:
            self.no_agreement = no_agreement
        if no_trip:
            self.no_trip = no_trip
        if name_contract:
            self.name_contract = name_contract.lower()
        if id_person:
            self.id_number = id_person
        if purpose:
            self.purpose = purpose.lower()
        if id_route:
            self.id_route = id_route
        if id_type_agreement:
            self.id_type_agreement = id_type_agreement
        if init_date:
            self.init_date = datetime.strptime(init_date, "%Y-%m-%d")
        if last_date:
            self.last_date = datetime.strptime(last_date, "%Y-%m-%d")