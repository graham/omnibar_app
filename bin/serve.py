#! /usr/bin/env python
from bottle import route, run, static_file, request
import os
import json
 
@route('/:path#.+#')
def server_static(path):
    if path.endswith('/'):
        path = path.replace('..', '')
        return json.dumps(os.listdir(os.path.abspath(path)))
    else:
        return open(os.path.abspath(path)).read()

@route('/admin/user_info', method='POST')
def poster():
    return "raw: %s" % str(request.body.read())
 
import sys
 
if len(sys.argv) > 1:
    port = int(sys.argv[1])
else:
    port = 4040
 
run(host='0.0.0.0', port=port)
