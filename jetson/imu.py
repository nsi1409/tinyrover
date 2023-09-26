import socket
import time
import serial
import pywitmotion as wit

from port_grep import find, list_all

# port = find(list_all())
# print(port)

from serial import *
usb = Serial('COM3', 9600)
# usb = Serial(port)
usb.timeout = 1
while True:
    # print(usb.readline()) # you need to print what you are reading in the script
    s = usb.read_until(b'U')
    # for msg in s:c
    # q = wit.get_quaternion(s)
    # q = wit.get_angle(s)
    # q = wit.get_gyro(s)
    # q = wit.get_acceleration(s)
    q = wit.get_magnetic(s)
    if q is not None:
        print(q)