import math
import time
import serial
import struct
import port_grep
from serial import *
from kv import send_kv

port = port_grep.find(6790)
usb = Serial(port, 9600, timeout=1)

while True:
	s = usb.read_until(b'U')
	# print(s)
	# print(s[0])
	try:
		match s[0]:
			case 84:
				(magx, magy, magz) = struct.unpack("<hhh", s[1:7])
				rectifiedx = magx+5000
				rectifiedy = magy
				scuffed_yaw = math.atan2(rectifiedy, rectifiedx)
				print(scuffed_yaw)
				# print("magnetic: " + str(s))
				# print(str(magx) + " " + str(magy) + " " + str(magz))
	except Exception as e:
		print(e)
		print('reading loop fail, retrying')
