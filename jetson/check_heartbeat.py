import time
from kv import grab_kv
from kv import default_value
import requests

allowed_flatline_time_ms = 4500
time_between_listens_ms = 800

most_recent_heard = None
most_recent_beat = None
second_most_recent_beat = None

#TODO: fix this

while 1:
	heartbeat_value = grab_kv('heartbeat')
	if(heartbeat_value == default_value):
		print('waiting for heartbeat...')
		time.sleep(time_between_listens_ms / 1000)
		continue

	current_time = int(time.time() * 1000)
	most_recent_heard = heartbeat_value.get('v')    
	last_beat_time = current_time + most_recent_heard

	if(not most_recent_beat):
		print('heard first beat')
		most_recent_beat = last_beat_time
		time.sleep(time_between_listens_ms / 1000)
		continue
	if (last_beat_time != most_recent_beat):
		second_most_recent_beat = most_recent_beat
		most_recent_beat = last_beat_time
		print('heard heartbeat at time ' + str(last_beat_time))
	print('difference between beats is ' + str(most_recent_beat - second_most_recent_beat))
	if (most_recent_beat - second_most_recent_beat) > allowed_flatline_time_ms:
		try:
			print('sending stop command to wheels after not hearing heartbeat')
			r = requests.get('http://localhost:8080/wheel_command', json={
				"left": 90, "right": 90
			}, timeout=1)
		except:
			print('failed to send stop to wheels')
	
	time.sleep(time_between_listens_ms / 1000)
