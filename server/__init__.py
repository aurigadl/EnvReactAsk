from flask import Flask
from server import config

from flask_sqlalchemy import SQLAlchemy
from flask import g
from rbac import RBAC as r

rbac = r.RBAC()
db = SQLAlchemy()
g_data = g

# Configuration
app = Flask(__name__, static_folder='./static', static_url_path='')
app.config.from_object(config.devConfig1)
db.app = app
db.init_app(app)
rbac.init_app(app)

from server.apiUser.models import User
from server.apiRole.models import Role
from server.apiUser.api import apiUser
from server.apiRole.api import apiRole
from server.apiMarcas.api import apiMarca
from server.apiSystem.api import apiSystem
from server.apiRuta.api import apiRuta
from server.apiTipoContrato.api import apiTipoContrato

app.register_blueprint(apiUser)
app.register_blueprint(apiRole)
app.register_blueprint(apiSystem)
app.register_blueprint(apiMarca)
app.register_blueprint(apiRuta)
app.register_blueprint(apiTipoContrato)