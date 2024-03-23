import requests
import time

default_antenna_ip = "192.168.1.10" # This may change over time, here for reference
default_rovernet_ip = "192.168.0.12" # This may change over time, here for reference

active_ip = default_antenna_ip

def send2wheels_both(l, r):
	req = requests.get('http://' + active_ip + ':8080/wheel_command_both', json={
		"left": l, "right": r
	})
def send2wheels_left(l):
	req = requests.get('http://' + active_ip + ':8080/wheel_command_left', json={
		"left": l
	})
def send2wheels_right(r):
	req = requests.get('http://' + active_ip + ':8080/wheel_command_right', json={
		"right": r
	})
	

#Set rover ip, typically an internal address, see default parameters 
def set_active_ip(rover_ip):
	global active_ip
	active_ip = rover_ip

if __name__ == "__main__":
	set_active_ip(default_rovernet_ip)
	while True:
		# send2wheels_both(120, 120)
		# time.sleep(2)
		# send2wheels_both(50, 50)
		# time.sleep(2)
		send2wheels_both(90, 90)
