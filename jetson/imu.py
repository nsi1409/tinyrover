import math
import time
import serial
import struct
import port_grep
from serial import *
import requests

port = port_grep.find(6790)
usb = Serial(port, 9600, timeout=1)

def send_kv(k, v):
	r = requests.put('http://127.0.0.1:5000/data', json={'k': k, 'v': v})

while True:
	s = usb.read_until(b'U')
	try:
		match s[0]:
			case 83: #euler angles
				(rollr, pitchr, yawr) = struct.unpack("<hhh", s[1:7])
				roll = (rollr / 32768) * 180
				pitch = (pitchr / 32768) * 180
				yaw = (yawr / 32768) * 180 + 180
				send_kv('yaw', yaw)
				print(yaw)
			case 89: #quaternion
				qr = struct.unpack("<hhhh", s[1:9])
				q = tuple(el / 32768 for el in qr)
				send_kv('quat', q)
				print(q)
			case _: #default case
				pass
				#print(f'uncaught {s[0]}: {s}')
	except Exception as e:
		print(e)
		print('reading loop fail, retrying')
