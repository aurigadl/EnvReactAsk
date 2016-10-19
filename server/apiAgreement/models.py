from server import db


class Agreement(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'agreement'
    id = db.Column(db.Integer, primary_key=True)
    no_agreement = db.Column(db.Integer, nullable=False)
    no_trip = db.Column(db.Integer, nullable=False)
    id_type = db.Column(db.Integer, db.ForeignKey('id_type.id'))
    nit_1 = db.Column(db.Integer)
    nit_2 = db.Column(db.Integer)
    object = db.Column(db.String(255))
    id_route = db.Column(db.Integer, db.ForeignKey('ruta.id'))
    id_type_agreement = db.Column(db.Integer, db.ForeignKey('tipo_contrato.id'))
    init_date = db.Column(db.DateTime())
    last_date = db.Column(db.DateTime())

    def __init__(self,
                 no_agreement=None,
                 no_trip=None,
                 id_type=None,
                 nit_1=None,
                 nit_2=None,
                 object=None,
                 id_route=None,
                 id_type_agreement=None,
                 init_date=None,
                 last_date=None):

        if no_agreement:
            self.no_agreement = no_agreement
        if no_trip:
            self.no_trip = no_trip
        if id_type:
            self.id_type = id_type
        if nit_1:
            self.nit_1 = nit_1
        if nit_2:
            self.nit_2 = nit_2
        if object:
            self.object = object.lower()
        if id_route:
            self.id_route = id_route
        if id_type_agreement:
            self.id_type_agreement = id_type_agreement
        if init_date:
            self.init_date = init_date
        if last_date:
            self.last_date = last_date