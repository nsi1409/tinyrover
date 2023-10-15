import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import random

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.set_xlim([-1, 1])
ax.set_ylim([-1, 1])
ax.set_zlim([-1, 1])
v = None

for i in range(10000):
	soa = np.array([[0, 0, 0, random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1)]])
	X, Y, Z, U, V, W = zip(*soa)
	if v:
		v.remove()
	v = ax.quiver(X, Y, Z, U, V, W)
	plt.pause(0.005)

plt.show()
