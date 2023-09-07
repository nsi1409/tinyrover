from flask import Flask, request
from rover2arduino import Controller
import socket

app = Flask(__name__)

try:
	wheels = Controller()
	@app.route('/wheel_command', methods=['GET', 'POST', 'PUT'])
	def process_json():
		content_type = request.headers.get('Content-Type')
		if (content_type == 'application/json'):
			json = request.json
			print(json["left"])
			print(json["right"])
			# use rover2arduino.send2wheels(args) to write to arduino
			return str(json)
		else:
			return 'Content-Type not supported!'
except:
	@app.route('/wheel_command', methods=['GET', 'POST', 'PUT'])
	def no_connect():
		if request.data:
			left = request.json['left']
			right = request.json['right']
		else:
			left = None
			right = None
		return f'connecting to arduino failed\nsent values({left}, {right})\n', 500

@app.route('/ping', methods=['GET', 'POST', 'PUT'])
def pingpong():
	return 'pong\n', 200

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8080, debug=True, threaded=False)
