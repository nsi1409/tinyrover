import math
import socket
import time
import serial
import pywitmotion as wit
import struct

from port_grep import find, list_all

# port = find(list_all())
# print(port)

from serial import *
usb = Serial('COM3', 9600)
# usb = Serial(port)
usb.timeout = 1
while True:
    # s = usb.readline()
    # print(usb.readline()) # you need to print what you are reading in the script
    s = usb.read_until(b'U')
    # print(s[0])
    try:
        if(s[0] == 83):
            (rollr, pitchr, yawr) = struct.unpack("<hhh", s[1:7])
            roll = (rollr / 32768) * 180
            pitch = (pitchr / 32768) * 180
            yaw = (yawr / 32768) * 180 + 180
            print(yaw)
    except:
        pass
    
    # if(s[0] == 89):
    #     qr = struct.unpack("<hhhh", s[1:9])
    #     q = tuple(el / 32768 for el in qr)
    #     print(q)
    # q = wit.get_angle(s)
    # if q is not None:
    #         print(q)