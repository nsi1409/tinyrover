import requests

def send2wheels_both(l, r):
	r = requests.get('192.168.0.12:8080/wheel_command_both', json={
		"left": l, "right": r
	})
def send2wheels_left(l):
	r = requests.get('192.168.0.12:8080/wheel_command_left', json={
		"left": l
	})
def send2wheels_right(r):
	r = requests.get('192.168.0.12:8080/wheel_command_right', json={
		"right": r
	})
	

if __name__ == "__main__":
	send2wheels_both(4, 7)
