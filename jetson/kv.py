from flask import Flask, request
import numpy as np
import math

app = Flask(__name__)
state = {}

@app.route('/data', methods=['GET', 'PUT'])
def data():
	data = request.get_json()
	if request.method == 'PUT':
		k = data['k']
		v = data['v']
		state[k] = v
		return 'ok', 200
	else:
		k = data['k']
		v = state[k]
		return {'v': v}, 200

rate = 0.2
v = [1, 0, 0]
@app.route('/brown')
def brownian():
	v[0] -= rate * np.random.randn()
	v[1] -= rate * np.random.randn()
	v[2] -= rate * np.random.randn()
	magnitude = math.dist(v, [0, 0, 0])
	v[0] /= magnitude
	v[1] /= magnitude
	v[2] /= magnitude
	return v

if __name__ == '__main__':
	app.run()
