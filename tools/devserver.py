#!/usr/bin/env python3
"""Dev server for Afaq.

python -m http.server sends Last-Modified with no Cache-Control, so browsers apply
heuristic freshness and serve modules from memory WITHOUT revalidating. That makes an
edit invisible to the page while every test still passes -- against the old code.
This server sends no-store on everything, so what the browser runs is what is on disk.
"""
import sys, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoStore(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, fmt, *a):
        if '304' not in (a[1] if len(a) > 1 else ''):
            super().log_message(fmt, *a)

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8125
    root = sys.argv[2] if len(sys.argv) > 2 else '.'
    handler = functools.partial(NoStore, directory=root)
    print(f'afaq dev server on http://localhost:{port} (no-store)')
    ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
