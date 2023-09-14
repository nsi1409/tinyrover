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

def wheels():
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):
		json = request.json
		left = json["left"]
		right = json["right"]
		j2a.send([0, left, right])
		return str(json)
	else:
		return 'Content-Type not supported!'

try:
	j2a = jetson2arduino.Messenger()
	@app.route('/wheel_command', methods=['GET', 'POST', 'PUT'])
	def wheels_call():
		return wheels()
except Exception as e:
	print(e)
	err = e
	@app.route('/wheel_command', methods=['GET', 'POST', 'PUT'])
	def no_connect_call():
		return no_connect()

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8080, debug=True, threaded=False)
