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

def exit_handler():
    ser.flush() #flushes and closes on exit
    ser.close()

atexit.register(exit_handler)

def test_left_wheels(speed):
	data = [1,speed] # Values from 0 - 255 allowed in each entry
	print("left speed ",speed)
	bytesToSend = bytes(data)
	# print("As bytes: ")
	# for i in bytesToSend:
	# 	print(i)
	ser.write(bytesToSend)

def test_right_wheels(speed):
	data = [2,speed] # Values from 0 - 255 allowed in each entry
	print("right speed ",speed)
	bytesToSend = bytes(data)
	# print("As bytes: ")
	# for i in bytesToSend:
	# 	print("\t",i)
	ser.write(bytesToSend)

def test_both_wheels(left_speed,right_speed):
	data = [0,left_speed,right_speed] # Values from 0 - 255 allowed in each entry
	print("left speed ",left_speed)
	print("right speed ",right_speed)
	bytesToSend = bytes(data)
	ser.write(bytesToSend)



if __name__ == "__main__":
	for i in range(100000):
		test_left_wheels(150)
		test_right_wheels(150)
