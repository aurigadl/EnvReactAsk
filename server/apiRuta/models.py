from server import db


class Ruta(db.Model):
    __tablename__ = 'ruta'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500), nullable=False, unique=True)

    def __init__(self, name=None):
        if name:
            self.name = name.lower()
