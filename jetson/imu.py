import math
import struct
import port_grep
import json
from serial import *
from kv import send_kv

port = port_grep.find(6790)
usb = Serial(port, 9600, timeout=1)

calibration_data_file = open('calibration/imu_cal.json')
calibration_data = json.load(calibration_data_file)
max_x = calibration_data['maxX']
min_x = calibration_data['minX']
max_y = calibration_data['maxY']
min_y = calibration_data['minY']

while True:
	try:
		s = usb.read_until(b'U')
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
			case 84: #magnetic field
				(magx, magy, magz) = struct.unpack("<hhh", s[1:7])
				x_range = max_x - min_x
				y_range = max_y - min_y
				adjusted_x = (2 * ((magx - min_x) / x_range)) - 1
				adjusted_x = adjusted_x * -1
				adjusted_y = (2 * ((magy - min_y) / y_range)) - 1
				scuffed_yaw = math.atan2(adjusted_x, adjusted_y)
				send_kv('scuffed_yaw', scuffed_yaw)
			case 89: #quaternion
				qr = struct.unpack("<hhhh", s[1:9])
				q = tuple(el / 32768 for el in qr)
				send_kv('quat', q)
			case 87: #latitude and longitude
				(longu, longl, latu, latl) = struct.unpack("<hhhh", s[1:9])
				# send_kv('lat long', l)
			case _: #default case
				pass
		print('imu.py is running...')
	except Exception as e:
		print(e)
		print('reading loop fail, retrying')