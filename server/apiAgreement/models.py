from datetime import datetime
from server import db


class Agreement(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'agreement'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    no_agreement = db.Column(db.Integer, nullable=False, unique=True)
    no_trip = db.Column(db.Integer, nullable=False)
    id_person = db.Column(db.Integer, db.ForeignKey('person.id'))
    id_type_agreement = db.Column(db.Integer, db.ForeignKey('kind_hiring.id'))
    init_date = db.Column(db.DateTime())
    last_date = db.Column(db.DateTime())
    file_pdf  = db.Column(db.LargeBinary)

    def __init__(self,
                 no_agreement=None,
                 created_by=None,
                 no_trip=None,
                 id_person=None,
                 id_type_agreement=None,
                 init_date=None,
                 last_date=None,
                 file_pdf=None):

        if no_agreement:
            self.no_agreement = no_agreement
        if created_by:
            self.created_by = created_by
        if no_trip:
            self.no_trip = no_trip
        if id_person:
            self.id_person = id_person
        if id_type_agreement:
            self.id_type_agreement = id_type_agreement
        if init_date:
            self.init_date = datetime.strptime(init_date, "%Y-%m-%d")
        if last_date:
            self.last_date = datetime.strptime(last_date, "%Y-%m-%d")
        if file_pdf:
            self.file_pdf = file_pdf