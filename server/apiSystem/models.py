import base64

from server import db


def image_format(imgInBinary):
    if imgInBinary:
        header = 'data:image/png;base64,'
        image = base64.b64encode(imgInBinary)
        return header + image
    return None


class System(db.Model):
    __tablename__ = 'system'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    owner = db.Column(db.String(255))
    phone = db.Column(db.Integer)
    email = db.Column(db.String(255))
    nit_1 = db.Column(db.Integer)
    nit_2 = db.Column(db.Integer)
    logo = db.Column(db.LargeBinary)
    sign = db.Column(db.LargeBinary)
    id_company_legal = db.Column(db.Integer, default=0)
    secuence_contract = db.Column(db.Integer, default=0)
    secuence_payroll = db.Column(db.Integer, default=0)
    secuence_vehicle = db.Column(db.Integer, default=0)

    def __init__(self
                 , name=None
                 , address=None
                 , owner=None
                 , phone=None
                 , email=None
                 , nit_1=None
                 , nit_2=False
                 , logo=None
                 , sign=None
                 , id_company_legal=None
                 , secuence_contract=False
                 , secuence_payroll=False
                 , secuence_vehicle=False
                 ):
        if name:
            self.name = name.lower()
        if address:
            self.address = address.lower()
        if owner:
            self.owner = owner.lower()
        if phone:
            self.phone = phone
        if email:
            self.email = email.lower()
        if nit_1:
            self.nit_1 = nit_1
        if nit_2:
            self.nit_2 = nit_2
        if logo:
            self.logo = logo
        if sign:
            self.sign = sign
        if id_company_legal:
            self.id_company_legal = id_company_legal
        if secuence_contract:
            self.secuence_contract = secuence_contract
        if secuence_payroll:
            self.secuence_payroll = secuence_payroll
        if secuence_vehicle:
            self.secuence_vehicle = secuence_vehicle

    def get_json(self):
        return dict(name=self.name
                    , address=self.address
                    , owner=self.owner
                    , phone=self.phone
                    , email=self.email
                    , nit_1=self.nit_1
                    , nit_2=self.nit_2
                    , logo=image_format(self.logo)
                    , sign=image_format(self.sign)
                    , id_company_legal=self.id_company_legal
                    , secuence_contract=self.secuence_contract
                    , secuence_payroll=self.secuence_payroll
                    , secuence_vehicle=self.secuence_vehicle
                    )
