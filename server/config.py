import os


class config(object):
    DEBUG = False
    RBAC_USE_WHITE = True
    TOKEN_SECRET = os.environ.get('SECRET_KEY') or os.urandom(24)
    UPLOAD_FOLDER = './upload_folder'
    STATIC_FOLDER = './static'
    TMP_SESSION = './tmp_app_session'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    ALLOWED_EXTENSIONS = set(['pdf', 'png'])
    SQLALCHEMY_ECHO = False
    SECRET_KEY = str(os.urandom(24)) + 'SRT#$ASDF_;:' + str(os.urandom(24))


class devConfig1(config):
    DEBUG = True
    SQLALCHEMY_ECHO = False
    SECRET_KEY = str(os.urandom(4)) + 'CAT' + str(os.urandom(4))


class devConfig2(config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SECRET_KEY = str(os.urandom(4)) + 'DOG' + str(os.urandom(4))
