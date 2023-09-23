from flask import Flask, request
import jetson2arduino
import socket

app = Flask(__name__)
err = None

@app.route('/ping', methods=['GET', 'POST', 'PUT'])
def pingpong():
    return 'pong\n', 200

def no_connect():
    left = None
    right = None
    if request.data:
        left = request.json['left']
        right = request.json['right']
    return f'error: {err} | sent values: ({left}, {right})', 500

def wheel_both():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        left = json["left"]
        right = json["right"]
        j2a.send_both(left, right)
        return str(json)
    else:
        return 'Content-Type not supported!'
    
def wheel_left():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        left = json["left"]
        j2a.send_left(left)
        return str(json)
    else:
        return 'Content-Type not supported!'
    
def wheel_right():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        right = json["right"]
        j2a.send_right(right)
        return str(json)
    else:
        return 'Content-Type not supported!'

try:
    j2a = jetson2arduino.Messenger()
    @app.route('/wheel_command_both', methods=['GET', 'POST', 'PUT'])
    def wheel_call_both():
        return wheel_both()
    @app.route('/wheel_command_left', methods=['GET', 'POST', 'PUT'])
    def wheel_call_left():
        return wheel_left()
    @app.route('/wheel_command_right', methods=['GET', 'POST', 'PUT'])
    def wheel_call_right():
        return wheel_right()
except Exception as e:
    print(e)
    err = e
    @app.route('/wheel_command_both', methods=['GET', 'POST', 'PUT'])
    def no_connect_call():
        return no_connect()
    @app.route('/wheel_command_right', methods=['GET', 'POST', 'PUT'])
    def no_connect_call():
        return no_connect()
    @app.route('/wheel_command_left', methods=['GET', 'POST', 'PUT'])
    def no_connect_call():
        return no_connect()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True, threaded=False)
