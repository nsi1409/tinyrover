import math
import time
import turn
import sys
sys.path.append("..")
import jetson2arduino
from kv import grab_kv, grab_brown

tolerance = 2 / 111111
try:
	j2a = jetson2arduino.Messenger()
except:
	pass


def go(coords):
	while(1):
		try:
			brown = grab_brown()
			current = [brown[0], brown[1]]
			print(current)
		except:
			#j2a.send(0, 0)
			continue
		if math.sqrt(((current[0] - coords[0])**2) + ((current[1] - coords[1])**2)) < tolerance:
			#j2a.send(0, 0)
			print(f'arrived at {coords}')
			return True
		else:
			turn.turn([0, 0], coords)
			#j2a.send(1, 1)
			time.sleep(1)


if __name__ == '__main__':
	course = [[39.4848053, -87.3232079]]
	for coords in course:
		go(coords)
