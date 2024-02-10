import requests
import time

def send2wheels_both(l, r):
	req = requests.get('http://192.168.0.12:8080/wheel_command_both', json={
		"left": l, "right": r
	})
def send2wheels_left(l):
	req = requests.get('http://192.168.0.12:8080/wheel_command_left', json={
		"left": l
	})
def send2wheels_right(r):
	req = requests.get('http://192.168.0.12:8080/wheel_command_right', json={
		"right": r
	})
	

if __name__ == "__main__":
	while True:
		send2wheels_both(150, 150)
		time.sleep(5)
		send2wheels_both(90, 90)
		time.sleep(20)
