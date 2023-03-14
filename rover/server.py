from flask import Flask, request
# import serial
import time

# ser = serial.Serial('/dev/cu.usbmodem2101', 9600, timeout=1)
# print(ser.portstr)

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
        return json
    else:
        return 'Content-Type not supported!'