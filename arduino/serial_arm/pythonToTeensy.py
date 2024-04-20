import serial
import time

#This code was formed according to this tutorial: https://projecthub.arduino.cc/ansh2919/serial-communication-between-python-and-arduino-663756
#The purpose of this script is to verify serial communication from the computer to the teensy
#Entering a number of milliseconds should affect th blinking rate of the teensy
#Upload the corresponding Arduino code on the teensy befor launching this script.

ser = serial.Serial()
ser.setDTR(False)
ser.port = 'COM5' #change this COM to match the one specified in Arduino
ser.baudrate = 9600 #This number should match the one specified in arduino
ser.timeout = 1
ser.bytesize = serial.EIGHTBITS
ser.stopbits = serial.STOPBITS_ONE
ser.parity =serial.PARITY_NONE
ser.close()
ser.open()

def write_read(x):
    ser.write(bytes(x,  'utf-8'))
    time.sleep(0.05)
    data = ser.readline()
    return  data


while True:
    num = input("Enter a number: ")
    value  = write_read(num)
    print(value)
