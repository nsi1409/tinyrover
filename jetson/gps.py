from flask import Flask
import time
import serial
import csv
import sys
import os
import port_grep
from kv import send_kv

port = port_grep.find(1659)
gps = serial.Serial(port, 4800, timeout=None)

def parse():
	try:
		inpt = gps.readline()
		# print(inpt)
		str_inpt = inpt.decode('utf-8')
		# print(str_inpt)
		return str_inpt.split(",")
	except Exception as exc:
		exc_type, exc_obj, exc_tb = sys.exc_info()
		fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
		print(exc_type, fname, exc_tb.tb_lineno)
		print('reading loop fail, retrying')
		return "Failed"


app = Flask(__name__)

def min2dec(inpt):
	if (inpt == ''):
		return "No"
	else:
		finpt = float(inpt)
		outp = (finpt // 100) + ((finpt % 100) / 60)
		return outp


def returnCord():
	parse_outp = parse()
	if (parse_outp == [[]]):
		return
	elif (parse_outp[0] == "$GPGGA"):
		north = min2dec(parse_outp[2])
		west = min2dec(parse_outp[4])
		if (north == "No" or west == "No"):
			print(f'Lost Cords')
			return
		print(f'North is {north}')
		print(f'West is {west}')
		send_kv('gps', [north, west])


while (1):
	returnCord()