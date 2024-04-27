import time
import random
import math
import sys
sys.path.append("..")
from kv import grab_kv, grab_brown

def turn(location, target): # assumes all angles to be in the range 0, 2*pi (or tau), with numbers assending going clockwise
	left = 0
	right = 0
	while(True):
		target_heading = math.atan2(target[0]-location[0], target[1]-location[1])
		try:
			heading = grab_kv('scuffed_yaw')['v'] # comes in range -pi, pi 
			heading += math.pi # these lines convert to range 0, 2pi
			heading %= 2*math.pi
			print(heading)
		except:
			heading, _, _, _ = grab_brown()
			heading %= 2*math.pi
			print('not found simulating heading')
		if target_heading < heading:
			target_heading += 2*math.pi
		angle_right = target_heading - heading
		difference = abs(angle_right)
		if difference < (math.pi/6):
			print('close enough')
			break
		elif angle_right < math.pi:
			left = 1
			right = 0
		else:
			left = 0
			right = 1
		print(f'left: {left}, right: {right}, target_heading: {target_heading}, heading: {heading}, difference: {difference}, location: {location}, target: {target}')
		time.sleep(0.2)


if __name__ == '__main__':
	while(1):
		location = [random.uniform(0, 60), random.uniform(0, 60)]
		target = [random.uniform(0, 60), random.uniform(0, 60)]
		turn(location, target)
