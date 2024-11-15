import time
from kv import grab_kv

while 1:
	last_beat = grab_kv('heartbeat')
	print(last_beat)
	time.sleep(1)
	#TODO for Ian: implement pseudo code
	'''
	if last_beat more than 5 seconds ago:
		send (90, 90) to localhost/wheel_command using requests library (check the readme to see how to do this)
	'''
