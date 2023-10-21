import clifford as cf
import random
import warnings
import numpy as np

#warnings.filterwarnings("ignore")
warnings.simplefilter("ignore")

layout, blades = cf.Cl(3)
locals().update(blades)
#print(blades)

def three_space_euclidean(v0, v1):
	return math.dist(v0, v1)

def clifford_engine(vector, rotation, normalize=False):
	vector = vector[0]*e1 + vector[1]*e2 + vector[2]*e3
	rotation = rotation[0] + rotation[1]*e12 + rotation[2]*e23 + rotation[3]*e13
	rotation = rotation.normal()
	if normalize:
		vector = vector.normal()
	final = rotation*vector*~rotation
	return final.value[1:4]

def hamiltonian_engine(vector, rotation, normalize=False):
	#todo
	pass

v = np.random.uniform(-1, 1, [3])
r = np.random.uniform(-1, 1, [4])

if __name__ == '__main__':
	R = random.random() + random.random()*e12 + random.random()*e23 + random.random()*e13
	R = R.normal()
	print(R)

	vec = random.random()*e1 + random.random()*e2 + random.random()*e3
	vec = vec.normal()
	print(vec)

	final = R*vec*~R
	print(final)
	print(abs(final))

	final = clifford_engine(v, r, normalize=True)
	print(final)
