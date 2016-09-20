from flask_sqlalchemy import SQLAlchemy
from rbac import RBAC
from flask import g

db = SQLAlchemy()
rbac = RBAC()
g_data = g
