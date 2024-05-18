from flask import Flask, request
import jetson2arduino
import socket
import argparse
import time

parser = argparse.ArgumentParser()
parser.add_argument('-e', '--emulate', action='store_true')
options = parser.parse_args()

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

def wheel_stop():
	left = 90
	right = 90
	j2a.send_both(left, right)
	return str(json)

def wheel_trim():
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):
		json = request.json
		trim = json["trim"]
		magnitude = json["magnitude"]
		if(trim > 0):
			right = magnitude
			left = magnitude * (1 - control)
		else:
			left = magnitude
			right = magnitude * (1 - ((-1) * control))
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


while(1):
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

		@app.route('/wheel_command_stop', methods=['GET', 'POST', 'PUT'])
		def wheel_call_stop():
			return wheel_stop()

		@app.route('/wheel_command_trim', methods=['GET', 'POST', 'PUT'])
		def wheel_call_trim():
			return wheel_trim()

	except Exception as e:
		print(e)
		err = e
		if not options.emulate:
			time.sleep(0.5)
			continue

		@app.route('/wheel_command_both', methods=['GET', 'POST', 'PUT'])
		def no_connect_both():
			return no_connect()

		@app.route('/wheel_command_right', methods=['GET', 'POST', 'PUT'])
		def no_connect_right():
			return no_connect()

		@app.route('/wheel_command_left', methods=['GET', 'POST', 'PUT'])
		def no_connect_left():
			return no_connect()

		@app.route('/wheel_command_stop', methods=['GET', 'POST', 'PUT'])
		def no_connect_stop():
			return no_connect()

		@app.route('/wheel_command_trim', methods=['GET', 'POST', 'PUT'])
		def no_connect_trim():
			return no_connect()

		break

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8080, debug=True, threaded=False)
