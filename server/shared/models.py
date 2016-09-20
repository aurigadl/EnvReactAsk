from flask_sqlalchemy import SQLAlchemy
from flask import g
from rbac import RBAC

db = SQLAlchemy()
rbac = RBAC()
g_data = g
