from server import db


class fuec(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'fuec'
    id = db.Column(db.Integer, primary_key=True)

    no_fuec = db.Column(db.Integer)
    social_object = db.Column(db.String(255), nullable=False)
    nit = db.Column(db.String(255))
    agreement_fuec_no = db.Column(db.Integer)
    contractor = db.Column(db.String(255))
    id_contractor = db.Column(db.Integer)
    agreement_object = db.Column(db.String(255))
    origin_destination = db.Column(db.String(1000))
    kind_hiring = db.Column(db.String(255))
    kind_link = db.Column(db.String(255))
    init_date = db.Column(db.String(255))
    last_date = db.Column(db.String(255))

    car_no = db.Column(db.Integer)
    car_license_plate = db.Column(db.String(255))
    car_model = db.Column(db.String(255))
    car_brand = db.Column(db.String(255))
    car_class_car = db.Column(db.Integer)
    car_operation = db.Column(db.String(255))

    data_driver_json = db.Column(db.String(1000))
    contractor_owner = db.Column(db.String(1000))

    def __init__(self,
                 no_fuec,
                 social_object,
                 nit,
                 agreement_fuec_no,
                 contractor,
                 id_contractor,
                 agreement_object,
                 origin_destination,
                 kind_hiring,
                 kind_link,
                 init_date,
                 last_date,
                 car_no,
                 car_license_plate,
                 car_model,
                 car_brand,
                 car_class_car,
                 car_operation,

                 data_driver_json,
                 contractor_owner):
        if no_fuec:
            self.no_fuec = no_fuec
        if social_object:
            self.social_object = social_object.lower()
        if nit:
            self.nit = nit
        if agreement_fuec_no:
            self.agreement_fuec_no = agreement_fuec_no
        if contractor:
            self.contractor = contractor
        if id_contractor:
            self.id_contractor = id_contractor
        if agreement_object:
            self.agreement_object = agreement_object
        if origin_destination:
            self.origin_destination = origin_destination
        if kind_hiring:
            self.kind_hiring = kind_hiring
        if kind_link:
            self.kind_link = kind_link.lower()
        if init_date:
            self.init_date = init_date
        if last_date:
            self.last_date = last_date
        if car_no:
            self.car_no = car_no
        if car_license_plate:
            self.car_license_plate
        if car_model:
            self.car_model = car_model
        if car_brand:
            self.car_brand = car_brand
        if car_class_car:
            self.car_class_car = car_class_car
        if car_operation:
            self.car_operation = car_operation
        if data_driver_json:
            self.data_driver_json = data_driver_json
        if contractor_owner:
            self.contractor_owner = contractor_owner