import os

DEBUG = True
RBAC_USE_WHITE = True
TOKEN_SECRET = os.environ.get('SECRET_KEY') or os.urandom(24)
SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
SQLALCHEMY_ECHO = False
