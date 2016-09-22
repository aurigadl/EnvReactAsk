import os

class config(object):
    DEBUG = False
    RBAC_USE_WHITE = True
    TOKEN_SECRET = os.environ.get('SECRET_KEY') or os.urandom(24)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_ECHO = False
    SECRET_KEY = str(os.urandom(24)) + 'SRT#$ASDF_;:' + str(os.urandom(24))

class devConfig1(config):
    DEBUG = True
    SQLALCHEMY_ECHO = False
    SECRET_KEY = str(os.urandom(4)) + 'SRT#$ASDF_;:' + str(os.urandom(4))

class devConfig2(config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
