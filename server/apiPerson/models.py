from server import db
from datetime import datetime


class IdType(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'id_type'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))

    def __init__(self, name=None):
        if name:
            self.name = name


class Person(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'person'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255))
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone = db.Column(db.Integer)
    id_number = db.Column(db.String(255), nullable=False, unique=True)
    id_type = db.Column(db.Integer, db.ForeignKey('id_type.id'))
    license = db.Column(db.String(255))
    effective_date = db.Column(db.DateTime())
    address = db.Column(db.String(255))

    def __init__(self,
                 first_name=None,
                 last_name=None,
                 email=None,
                 phone=None,
                 id_number=None,
                 id_type=None,
                 license=None,
                 effective_date=None,
                 address=None):
        if first_name:
            self.first_name = first_name.lower()
        if last_name:
            self.last_name = last_name.lower()
        if email:
            self.email = email.lower()
        if phone:
            self.phone = phone
        if id_number:
            self.id_number = id_number
        if id_type:
            self.id_type = id_type
        if license:
            self.license = license
        if effective_date:
            self.effective_date = datetime.strptime(effective_date, "%Y-%m-%d")
        if address:
            self.address = address.lower()
