import sys
sys.path.append("..")

import math
import time
import serial
import struct
import port_grep
from serial import *
from kv import send_kv

port = port_grep.find(6790)
usb = Serial(port, 9600, timeout=1)

minX = math.inf
maxX = -math.inf
minY = math.inf
maxY = -math.inf

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
				# print(scuffed_yaw)
				if (magx < minX):
					minX = magx
				if (magx > maxX):
					maxX = magx
				if (magy < minY):
					minY = magy
				if (magy > maxY):
					maxY = magy
				# print("magnetic: " + str(s))
				# print(str(magx) + " " + str(magy) + " " + str(magz))
				print("min x: " + str(minX) + ", max x: " + str(maxX) + ", min y: " + str(minY) + ", max y: " + str(maxY))
	except Exception as e:
		print(e)
		print('reading loop fail, retrying')
