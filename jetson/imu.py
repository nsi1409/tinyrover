import math
import socket
import time
import serial
import struct
from port_grep import find, list_all
from serial import *

# usb = Serial('COM3', 9600, timeout=1)
port = find(6790)
print(port)
usb = Serial(port, 9600, timeout=1)

while True:
	s = usb.read_until(b'U')
	#print(s)
	try:
		match s[0]:
			case 83: #euler angles
				(rollr, pitchr, yawr) = struct.unpack("<hhh", s[1:7])
				roll = (rollr / 32768) * 180
				pitch = (pitchr / 32768) * 180
				yaw = (yawr / 32768) * 180 + 180
				print(yaw)
			case 89: #quaternion
				qr = struct.unpack("<hhhh", s[1:9])
				q = tuple(el / 32768 for el in qr)
				print(q)
			case _: #default case
				pass
				#print(f'uncaught {s[0]}: {s}')
	except:
		print('reading loop fail, retrying')
