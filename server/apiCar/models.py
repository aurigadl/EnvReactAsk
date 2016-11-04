from datetime import datetime

from server import db


class ClassCar(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'classcar'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    def __init__(self, name=None):
        if name:
            self.name = name


class Car(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'car'
    id = db.Column(db.Integer, primary_key=True)
    no_car = db.Column(db.Integer, nullable=False, unique=True)
    license_plate = db.Column(db.String(255), nullable=False, unique=True)
    model = db.Column(db.Integer, nullable=False)
    brand = db.Column(db.Integer, db.ForeignKey('marca.id'), nullable=False)
    class_car = db.Column(db.Integer, db.ForeignKey('classcar.id'), nullable=False)
    operation_card = db.Column(db.String(255), nullable=False)

    def __init__(self,
                 no_car=None,
                 license_plate=None,
                 model=None,
                 brand=None,
                 class_car=None,
                 operation_card=None):
        if no_car:
            self.no_car = no_car
        if license_plate:
            self.license_plate = license_plate.lower()
        if model:
            self.model = model
        if brand:
            self.brand = brand.lower()
        if class_car:
            self.class_car = class_car
        if operation_card:
            self.operation_card = operation_card