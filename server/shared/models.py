import sys
from flask_sqlalchemy import SQLAlchemy
from flask import g

try:
    from rbac import RBAC as r
    rbac = r.RBAC()
except ImportError:
    sys.path.append('../rbac/RBAC')
    import RBAC as a
    rbac = a.RBAC()

db = SQLAlchemy()
g_data = g
