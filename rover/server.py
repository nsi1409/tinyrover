from flask import Flask, request
import time
from rover2arduino import Controller

app = Flask(__name__)

@app.route('/post_json', methods=['GET'])
def hello_world():
	val = 200
	outp = bytes(f"{val}\n", 'utf-8')
	print(outp)
	# ser.write(outp)
	val ^= 51400
	print('here')
	return "<p>Hello, World!</p>"

@app.route('/wheel_command', methods=['GET'])
def process_json():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        print(json["left"])
        print(json["right"])
		# use rover2arduino.send2wheels(args) to write to arduino
        return json
    else:
        return 'Content-Type not supported!'
