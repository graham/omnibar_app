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

import boto3
client = boto3.client('s3')

@route('/storage/exist')
def get_key():
    key = request.query.get('key')
    try:
        result = client.get_object(Bucket='baz.active',
                                   Key=key)
    except:
        return json.dumps(False)

    return json.dumps(True)

@route('/storage/get')
def get_key():
    key = request.query.get('key')
    try:
        result = client.get_object(Bucket='baz.active',
                                   Key=key)
    except:
        result = None

    if result is None:
        return ""
    else:
        return result['Body'].read()


@route('/storage/put', method='any')
def put_key():
    key = request.params.get('key') or request.query.get('key')
    value = request.params.get('value')

    try:
        result = client.put_object(Bucket='baz.active',
                                   Key=key,
                                   Body=value)
    except:
        return '0'

    return '1'

@route('/storage/list')
def list_keys():
    result = client.list_objects(Bucket='baz.active')
    keys = []

    for i in result.get('Contents', []):
        keys.append([i.get('Key'),
                     i.get('LastModified').strftime('%s'),
                     i.get('ETag')[1:-1]])

    return json.dumps(keys)

@route('/storage/since')
def since():
    moment = int(request.query.get('since'))
    result = client.list_objects(Bucket='baz.active')
    keys = []

    for i in result.get('Contents', []):
        if int(i.get('LastModified').strftime('%s')) > moment:
            keys.append(i.get('Key'))

    return json.dumps(keys)

import sys
 
if len(sys.argv) > 1:
    port = int(sys.argv[1])
else:
    port = 4040
 
run(host='127.0.0.1', port=port)
