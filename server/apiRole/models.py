from server import db
from server.rbac.model import RoleMixin

roles_parents = db.Table('roles_parents',
                         db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True),
                         db.Column('parent_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
                         )


class Role(db.Model, RoleMixin):
    __table_args__ = {'extend_existing': True}
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    modified_at = db.Column(db.DateTime, default=db.func.current_timestamp(),
                            onupdate=db.func.current_timestamp())

    name = db.Column(db.String(80), nullable=False, unique=True)
    description = db.Column(db.String(255))

    parents = db.relationship(
        'Role',
        secondary=roles_parents,
        primaryjoin=(id == roles_parents.c.role_id),
        secondaryjoin=(id == roles_parents.c.parent_id),
        backref=db.backref('children', lazy='dynamic')
    )

    def __init__(self, name, description):
        RoleMixin.__init__(self)
        self.name = name
        self.description = description

    def add_parent(self, parent):
        # You don't need to add this role to parent's children set,
        # relationship between roles would do this work automatically
        self.parents.append(parent)

    def add_parents(self, *parents):
        for parent in parents:
            self.add_parent(parent)

    @staticmethod
    def get_by_name(name):
        return Role.query.filter_by(name=name).first()
