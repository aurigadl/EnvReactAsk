import os

class config(object):
    DEBUG = False
    RBAC_USE_WHITE = True
    TOKEN_SECRET = os.environ.get('SECRET_KEY') or os.urandom(24)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_ECHO = False

class devConfig1(config):
    DEBUG = True
    SQLALCHEMY_ECHO = False

class devConfig2(config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
