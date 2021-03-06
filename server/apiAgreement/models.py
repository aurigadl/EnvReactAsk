from datetime import datetime

from server import db


class Agreement(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'agreement'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'))
    no_agreement = db.Column(db.Integer, nullable=False, unique=True)
    id_person = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    id_type_agreement = db.Column(db.Integer, db.ForeignKey('kind_agreement.id'))
    id_person_agreement = db.Column(db.Integer, db.ForeignKey('person.id'))
    id_object_agreement = db.Column(db.Integer, db.ForeignKey('objectAgreement.id'), nullable=False)
    file_pdf = db.Column(db.LargeBinary)
    person = db.relationship("Person", foreign_keys=[id_person])
    person_agreement = db.relationship("Person", foreign_keys=[id_person_agreement])

    def __init__(self,
                 no_agreement=None,
                 created_by=None,
                 id_person=None,
                 id_type_agreement=None,
                 id_person_agreement=None,
                 id_object_agreement=None,
                 file_pdf=None):

        if no_agreement:
            self.no_agreement = no_agreement
        if created_by:
            self.created_by = created_by
        if id_person:
            self.id_person = id_person
        if id_type_agreement:
            self.id_type_agreement = id_type_agreement
        if id_object_agreement:
            self.id_object_agreement = id_object_agreement
        if id_person_agreement:
            self.id_person_agreement = id_person_agreement
        if file_pdf:
            self.file_pdf = file_pdf