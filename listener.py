from flask import Flask
import serial
import time

ser = serial.Serial('/dev/cu.usbmodem2101', 9600, timeout=1)
print(ser.portstr)

app = Flask(__name__)

@app.route("/")
def hello_world():
	val = 200
	outp = bytes(f"{val}\n", 'utf-8')
	print(outp)
	ser.write(outp)
	val ^= 51400
	print('here')
	return "<p>Hello, World!</p>"
