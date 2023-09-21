import requests

def send2wheels(l, r):
	r = requests.get('http://rhitrover1-desktop:8080/wheel_command', json={
		"left": l, "right": r
	})

if __name__ == "__main__":
	send2wheels(4, 7)
