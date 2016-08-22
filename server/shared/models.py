from flask_sqlalchemy import SQLAlchemy
from flask_rbac import RBAC
from flask import g

db = SQLAlchemy()
rbac = RBAC()
g_data = g