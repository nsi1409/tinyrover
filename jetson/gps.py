import time
import serial
import sys
import os
import port_grep
from kv import send_kv

port = port_grep.find(1659)
gps = serial.Serial(port, 4800, timeout=None)

seconds_between_checks = 0.1

def parse():
	try:
		inpt = gps.readline()
		str_inpt = inpt.decode('utf-8')
		return str_inpt.split(",")
	except Exception as exc:
		exc_type, exc_obj, exc_tb = sys.exc_info()
		fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
		print(exc_type, fname, exc_tb.tb_lineno)
		print('reading loop fail, retrying')
		return "Failed"

def min2dec(inpt):
	if (inpt == ''):
		return "No"
	else:
		finpt = float(inpt)
		outp = (finpt // 100) + ((finpt % 100) / 60)
		return outp

while (1):
	try:
		parse_outp = parse()
		#print('Parsed GPS data: ' + str(parse_outp) + '\n')
		if (parse_outp == [[]]):
			print('GPS data was empty. Retrying...')
			time.sleep(seconds_between_checks)
			continue
		elif (parse_outp[0] == "$GPGGA"):
			north = min2dec(parse_outp[2])
			west = min2dec(parse_outp[4])
			if (north == "No" or west == "No"):
				print('Lost Cords')
				time.sleep(seconds_between_checks)
				continue
			print(f'North is {north}')
			print(f'West is {west}')
			send_kv('gps', [north, west])
	except Exception as e:
		print('Error occurred in GPS reading loop: ' + str(e))
	time.sleep(seconds_between_checks)
