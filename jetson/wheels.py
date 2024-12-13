from flask import Flask, request
import jetson2arduino
import argparse
import time
from flask_cors import CORS, cross_origin
import requests
import threading

parser = argparse.ArgumentParser()
parser.add_argument('-e', '--emulate', action='store_true')
options = parser.parse_args()

app = Flask(__name__)
err = None
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/ping', methods=['GET', 'POST', 'PUT'])
@cross_origin()
def pingpong():
	return 'pong\n', 200


def no_connect():
	left = None
	right = None
	if request.data:
		left = request.json['left']
		right = request.json['right']
	return f'error: {err} | sent values: ({left}, {right})', 500


@app.route('/wheel_command', methods=['GET', 'POST', 'PUT'])
@app.route('/wheel_command_both', methods=['GET', 'POST', 'PUT'])
@cross_origin()
def wheel_both():
	try:
		j2a = jetson2arduino.Messenger()
	except Exception as e:
		return no_connect()
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):
		json = request.json
		left = json["left"]
		right = json["right"]
		j2a.send_both(left, right)
		return str(json)
	else:
		return 'Content-Type not supported!'

@app.route('/wheel_command_stop', methods=['GET', 'POST', 'PUT'])
@cross_origin()
def wheel_stop():
	try:
		j2a = jetson2arduino.Messenger()
	except Exception as e:
		return no_connect()
	left = 90
	right = 90
	try:
		j2a.send_both(left, right)
		return 'success', 200
	except:
		return 'failed', 500

@app.route('/wheel_command_trim', methods=['GET', 'POST', 'PUT'])
@cross_origin()
def wheel_trim():
	json = request.json
	trim = json["trim"]
	magnitude = json["magnitude"]
	if(trim > 0):
		right = magnitude
		left = magnitude * (1 - trim)
	else:
		left = magnitude
		right = magnitude * (1 - ((-1) * trim))
	msg = f'trim drive left: {left}, right: {right}'
	print(msg)
	try:
		j2a = jetson2arduino.Messenger()
		j2a.send_both(left, right)
		return 'success: ' + msg, 200
	except:
		return 'failure: ' + msg, 500

@app.route('/wheel_command_left', methods=['GET', 'POST', 'PUT'])
@cross_origin()
def wheel_left():
	try:
		j2a = jetson2arduino.Messenger()
	except Exception as e:
		return no_connect()
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):
		json = request.json
		left = json["left"]
		j2a.send_left(left)
		return str(json)
	else:
		return 'Content-Type not supported!'

@app.route('/wheel_command_right', methods=['GET', 'POST', 'PUT'])
@cross_origin()
def wheel_right():
	try:
		j2a = jetson2arduino.Messenger()
	except Exception as e:
		return no_connect()
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):
		json = request.json
		right = json["right"]
		j2a.send_right(right)
		return str(json)
	else:
		return 'Content-Type not supported!'

def arm_joint_move():
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):
		json = request.json
		joint = json['joint']
		direction = json['direction']
		j2a.move_joint(joint,direction)
		return str(json)
	else:
		return 'Content-Type not supported!'

def stop_on_start():
	while(True):
		try:
			r = requests.get('http://localhost:8080/wheel_command', timeout=10, json={
				"left": 90, "right": 90
			})
			if(r.ok):
				break
		except:
			print("timeout")
		time.sleep(0.1)


if __name__ == '__main__':
	threading.Thread(target = lambda: app.run(host = '0.0.0.0', port = 8080, debug = True, threaded = False, use_reloader = False)).start()
	threading.Thread(target = stop_on_start).start()
