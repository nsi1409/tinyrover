from flask import Flask, request
import serial
import time
import atexit
# import os


# ser = serial.Serial('/dev/cu.usbmodem2101', 9600, timeout=1) #Maybe good for linux stuff
# ser = serial.Serial('COM3', 9600, timeout=1) #Windows 
ser = serial.Serial()
ser.setDTR(False)
ser.port = 'COM3'
ser.baudrate = 9600
ser.timeout = 5
ser.bytesize = serial.EIGHTBITS
ser.stopbits = serial.STOPBITS_ONE
ser.parity =serial.PARITY_NONE
ser.close()
ser.open()

# print(ser.is_open)
# ser.close()


# print(ser.portstr)


# app = Flask(__name__)



def exit_handler():
    ser.flush() #flushes and closes on exit
    ser.close()

atexit.register(exit_handler)

# @app.route('/post_json', methods=['GET'])
def hello_world():
    print(ser.is_open) #confirms port is open
    data = [1,2,3,4,5,6,7,8] # Values from 0 - 255 allowed in each entry
    bytesToSend = bytes(data)
    print(bytesToSend)
    ser.write(bytesToSend)
    result = ser.read(8)
    print(result)
    print(result == bytesToSend) # Verify received same thing as sent

# @app.route('/wheel_command', methods=['GET'])
def process_json():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        print(json["left"])
        print(json["right"])
        return json
    else:
        return 'Content-Type not supported!'


if __name__ == "__main__":
    hello_world()