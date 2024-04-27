import time
import random
import math
import sys
sys.path.append("..")
from kv import grab_kv, grab_brown

def turn(location, target):
	left = 0
	right = 0
	while(True):
		target_heading = math.atan2(target[0]-location[0], target[1]-location[1])
		try:
			heading = grab_kv('scuffed_yaw')['v']
			print(heading)
		except:
			heading, _, _, _ = grab_brown()
			print('not found simulating heading')
		difference = target_heading - heading
		if abs(difference) < (math.pi/6):
			break
		elif difference > 0:
			left = 1
			right = 0
		elif difference < 0:
			left = 0
			right = 1
		print(f'left: {left}, right: {right}, target_heading: {target_heading}, heading: {heading}, difference: {difference}, location: {location}, target: {target}')
		time.sleep(0.2)


if __name__ == '__main__':
	location = [random.uniform(0, 60), random.uniform(0, 60)]
	target = [random.uniform(0, 60), random.uniform(0, 60)]
	turn(location, target)