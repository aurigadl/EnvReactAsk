#!/home2/rediccol/env/wsgi/bin/python2.7
from flup.server.fcgi import WSGIServer
from werkzeug.debug import DebuggedApplication
from run import app

class ScriptNameStripper(object):
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        environ['SCRIPT_NAME'] = ''
        return self.app(environ, start_response)

app = ScriptNameStripper(app)

if __name__ == '__main__':
    WSGIServer(app).run()
