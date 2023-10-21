import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import random
import time
import requests

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.set_xlim([-1, 1])
ax.set_ylim([-1, 1])
ax.set_zlim([-1, 1])
v = None

def get_brown():
	r = requests.get('http://127.0.0.1:5000/brown')
	return r.json()

for i in range(10000):
	X, Y, Z = [0, 0, 0]
	U, V, W = get_brown()
	if v:
		v.remove()
	v = ax.quiver(X, Y, Z, U, V, W)
	plt.pause(0.005)

plt.show()
