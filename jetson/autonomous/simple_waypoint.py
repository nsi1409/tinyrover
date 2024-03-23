import math
import time
import turn
import sys
sys.path.append("..")
import jetson2arduino
from kv import grab_kv

tolerance = 2 / 111111
j2a = jetson2arduino.Messenger()


def go(coords):
	while(1):
		try:
			current = grab_kv()
		except:
			j2a.send(0, 0)
			continue
		if math.sqrt(((current[0] - coords[0])**2) + ((current[1] - coords[1])**2)) < tolerance:
			j2a.send(0, 0)
			print(f'arrived at {coords}')
			return True
		else:
			turn.turn(coords)
			j2a.send(1, 1)
			time.sleep(1)


if __name__ == '__main__':
	course = [[x, y], [x, y], [x, y]]
	for coords in course:
		go(coords)
