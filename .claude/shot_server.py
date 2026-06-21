# Dev-hulpje: ontvangt canvas-screenshots als base64 dataURL via POST
# en schrijft ze naar .claude/shots/<naam>.png. Alleen voor lokaal testen.
import base64
import os
import re
from http.server import BaseHTTPRequestHandler, HTTPServer

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots')
os.makedirs(OUT, exist_ok=True)


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        name = re.sub(r'[^a-zA-Z0-9_-]', '', self.path) or 'shot'
        b64 = re.sub(r'^data:image/png;base64,', '', body)
        with open(os.path.join(OUT, name + '.png'), 'wb') as f:
            f.write(base64.b64decode(b64))
        self.send_response(200)
        self._cors()
        self.end_headers()
        self.wfile.write(('saved ' + name + '.png').encode())

    def log_message(self, *args):
        pass


print('shot-server on 8733')
HTTPServer(('127.0.0.1', 8733), Handler).serve_forever()
