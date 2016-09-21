import sys, os
from flask_sqlalchemy import SQLAlchemy
from flask import g
from apiUser.models import User
from apiRole.models import Role

try:
    from rbac import RBAC as r
    rbac = r.RBAC()
except ImportError:
    absolute_dir = os.path.abspath('') + '/server'
    print absolute_dir
    sys.path.append(absolute_dir)
    from rbac import RBAC as a
    rbac = a.RBAC()

db = SQLAlchemy()
g_data = g
