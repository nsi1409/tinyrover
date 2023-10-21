import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import random
import time
import requests
import sys
sys.path.append('../lib')
import rotor

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.set_xlim([-1, 1])
ax.set_ylim([-1, 1])
ax.set_zlim([-1, 1])
v = None

def get_brown():
	r = requests.get('http://127.0.0.1:5000/brown')
	return r.json()

def get_quat():
	r = requests.get('http://127.0.0.1:5000/data', json={'k': 'quat'})
	q = r.json()['v']
	uv = rotor.clifford_engine([1, 0, 0], q, True)
	return uv

for i in range(10000):
	X, Y, Z = [0, 0, 0]
	#U, V, W = get_brown()
	U, V, W = get_quat()
	if v:
		v.remove()
	v = ax.quiver(X, Y, Z, U, V, W)
	plt.pause(0.005)

plt.show()
