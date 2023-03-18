import requests

def send2wheels(l, r):
	r = requests.get('http://127.0.0.1:5000/wheel_command', json={
		"left": l, "right": r
	})

if __name__ == "__main__":
	send2wheels(4, 7)
