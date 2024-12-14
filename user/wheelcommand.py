import requests
import time
import atexit
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-forward', action='store_true')
parser.add_argument('-left', action='store_true')
parser.add_argument('-right', action='store_true')
parser.add_argument('-backward', action='store_true')

# data coming in is in options
options = parser.parse_args()


def send2wheels_both(l, r):
	req = requests.get('http://192.168.0.12:8080/wheel_command_both', timeout=3, json={
		"left": l, "right": r
	})
def send2wheels_left(l):
	req = requests.get('http://192.168.0.12:8080/wheel_command_left', timeout=3, json={
		"left": l
	})
def send2wheels_right(r):
	req = requests.get('http://192.168.0.12:8080/wheel_command_right', timeout=3, json={
		"right": r
	})
def forward():
	print('going forward')
	send2wheels_both(110, 110)
	time.sleep(60)
def left():
	print('going left')
	send2wheels_both(90-20, 90+20)
	time.sleep(60)
def right():
	print('going right')
	send2wheels_both(90+20, 90-20)
	time.sleep(60)
def backward():
	print('going backwards')
	send2wheels_both(70, 70)
	time.sleep(60)
def trim(magnitude, trim, remote=True):
	print('trimming')
	if remote:
		uri = 'http://192.168.0.12:8080/wheel_command_trim'
	else:
		uri = 'http://localhost:8080/wheel_command_trim'
	req = requests.get(uri, timeout=3, json={
		"magnitude": magnitude, 
		"trim": trim 
	})
	time.sleep(60)

def stop_wheels():
	print('program exited, stopping wheels')
	send2wheels_both(90,90)
atexit.register(stop_wheels)

if __name__ == "__main__":
	if options.left:
		left()
	elif options.right:
		right()
	elif options.forward:
		forward()
	elif options.backward:
		backward()
	elif options.trim:
		while True:
			#send2wheels_both(150, 150)
			trim(1, 0, remote=False)
			time.sleep(5)
			#send2wheels_both(90, 90)
			trim(1, 0, remote=False)
			time.sleep(20)
