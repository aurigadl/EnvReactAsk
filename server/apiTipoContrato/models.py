from server import db


class TipoContrato(db.Model):
    __tablename__ = 'tipo_contrato'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)

    def __init__(self, name=None):
        if name:
            self.name = name.lower()
