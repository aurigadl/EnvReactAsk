from server import db

class PersonCar(db.Model):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'person_car'
    id = db.Column(db.Integer, primary_key=True)
    id_car = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    person_car = db.Column(db.Text, nullable=False)

    def __init__(self,
                 id_car=None,
                 person_car=None):

        if id_car:
            self.id_car = id_car

        if person_car:
            self.person_car = person_car