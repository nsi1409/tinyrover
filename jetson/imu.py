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
	#print(s)
	try:
		#print(s[0])
		match s[0]:
			case 83: #euler angles
				(rollr, pitchr, yawr) = struct.unpack("<hhh", s[1:7])
				roll = (rollr / 32768) * 180
				pitch = (pitchr / 32768) * 180
				yaw = (yawr / 32768) * 180 + 180
				send_kv('yaw', yaw)
				send_kv('roll', roll)
				send_kv('pitch', pitch)
				send_kv('euler', [roll, pitch, yaw])
				# print(yaw)
			case 84:
				(magx, magy, magz) = struct.unpack("<hhh", s[1:7])
    
				scuffed_yaw = math.atan2(magy, magx)
				send_kv('scuffed_yaw', scuffed_yaw)
			case 89: #quaternion
				qr = struct.unpack("<hhhh", s[1:9])
				q = tuple(el / 32768 for el in qr)
				send_kv('quat', q)
				#print(q)
			case 87: #latitude and longitude
				(longu, longl, latu, latl) = struct.unpack("<hhhh", s[1:9])
				# send_kv('lat long', l)
				print(latu)
			# case ground speed for next time
			case _: #default case
				pass
				#print(f'uncaught {s[0]}: {s}')
	except Exception as e:
		print(e)
		print('reading loop fail, retrying')
