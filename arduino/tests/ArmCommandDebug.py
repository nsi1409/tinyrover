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
ser.port = 'COM5'
ser.baudrate = 9600
ser.timeout = 1
ser.bytesize = serial.EIGHTBITS
ser.stopbits = serial.STOPBITS_ONE
ser.parity =serial.PARITY_NONE
ser.close()
ser.open()

def exit_handler():
    ser.flush() #flushes and closes on exit
    ser.close()

atexit.register(exit_handler)

def test_joint2(speed):
	data = [1,speed] # Values from 0 - 255 allowed in each entry
	print("left speed ",speed)
	bytesToSend = bytes(data)
	ser.write(bytesToSend)

if __name__ == "__main__":
	for i in range(100000):
		test_joint2(150)
