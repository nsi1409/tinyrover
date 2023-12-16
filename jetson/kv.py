from flask import Flask, request
import numpy as np
import math
import requests
import time

app = Flask(__name__)
state = {}

def send_kv(k, v):
	r = requests.put('http://127.0.0.1:5000/data', json={'k': k, 'v': v})

def grab_kv(k):
	r = requests.get('http://127.0.0.1:5000/data', json={'k': k})
	return r.json()

def grab_brown():
	r = requests.get('http://127.0.0.1:5000/brown')
	return r.json()

@app.route('/data', methods=['GET', 'POST', 'PUT'])
def data():
	data = request.get_json()
	if request.method == 'PUT':
		k = data['k']
		v = data['v']
		state[k] = v
		return 'ok', 200
	else:
		k = data['k']
		# v = state[k]
		if k in state:
			v = state[k]
			return {'v': v}, 200
		else:
			return ["no value"], 200

rate = 0.2
v = [1, 0, 0, 0]
@app.route('/brown')
def brownian():
	v[0] -= rate * np.random.randn()
	v[1] -= rate * np.random.randn()
	v[2] -= rate * np.random.randn()
	v[3] -= rate * np.random.randn()
	magnitude = math.dist(v, [0, 0, 0, 0])
	v[0] /= magnitude
	v[1] /= magnitude
	v[2] /= magnitude
	v[3] /= magnitude
	return v

@app.route('/brownsleep')
def browniansleep():
	v[0] -= rate * np.random.randn()
	v[1] -= rate * np.random.randn()
	v[2] -= rate * np.random.randn()
	v[3] -= rate * np.random.randn()
	magnitude = math.dist(v, [0, 0, 0, 0])
	v[0] /= magnitude
	v[1] /= magnitude
	v[2] /= magnitude
	v[3] /= magnitude
	time.sleep(0.25)
	return v

@app.route('/')
def slash():
	with open("kv.html") as f:
		html = f.read()
	return html, 200

if __name__ == '__main__':
	app.run()