from server import db


class Modality(db.Model):
    __tablename__ = 'modality'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)

    def __init__(self, name=None):
        if name:
            self.name = name.lower()
