import requests
from flask import Flask, request
import serial
import time
import atexit
import os


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

# def send2wheels(l, r):
# 	r = requests.get('http://127.0.0.1:5000/wheel_command', json={
# 		"left": l, "right": r
# 	})


def test_both_wheels():
    # print(ser.is_open) #confirms port is open
	data = [0,100,100] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	# result = ser.read(3)
	# print(result)
	# print(result == bytesToSend) # Verify received same thing as sent

def test_right_wheels():
    # print(ser.is_open) #confirms port is open
	data = [2,100] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	# result = ser.read(2)
	# print(result)
	# print(result == bytesToSend) # Verify received same thing as sent

def test_left_wheels():
	# print(ser.is_open) #confirms port is open
	data = [1,100] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	# result = ser.read(2)
	# print(result)
	# print(result == bytesToSend) # Verify received same thing as sent

def test_left_wheels(speed):
	# print(ser.is_open) #confirms port is open

	data = [1,speed] # Values from 0 - 255 allowed in each entry
	print("left speed ",speed)
	bytesToSend = bytes(data)
	print("As bytes: ")
	# for i in bytesToSend:
	# 	print(i)
	ser.write(bytesToSend)
	# result = ser.read(2)
	# print(result)
	# print(result == bytesToSend) # Verify received same thing as sent

def test_right_wheels(speed):
    # print(ser.is_open) #confirms port is open
	data = [2,speed] # Values from 0 - 255 allowed in each entry
	print("right speed ",speed)
	bytesToSend = bytes(data)
	# print("As bytes: ")
	# for i in bytesToSend:
	# 	print("\t",i)
	ser.write(bytesToSend)
	# result = ser.read(2)
	# print(result)
	# print(result == bytesToSend) # Verify received same thing as sent

def test_both_wheels(left_speed,right_speed):
    # print(ser.is_open) #confirms port is open
	data = [0,left_speed,right_speed] # Values from 0 - 255 allowed in each entry
	print("left speed ",left_speed)
	print("right speed ",right_speed)
	bytesToSend = bytes(data)
	ser.write(bytesToSend)



if __name__ == "__main__":
	# print("commented out :)")
	# send2wheels(4, 7)
	for i in range(100000):
		test_left_wheels(150)
		test_right_wheels(150)
