import time
from kv import grab_kv
from kv import default_value
import requests

allowed_flatline_time_ms = 4500
time_between_listens_ms = 800

most_recent_heard = None
most_recent_beat = None
most_recent_check = None

wheel_stop_sent = False

while 1:
	heartbeat_value = grab_kv('heartbeat')
	if(heartbeat_value == default_value):
		print('waiting for heartbeat...')
		time.sleep(time_between_listens_ms / 1000)
		continue
	
	updated_this_cycle = False #used for debugging
 
	current_time = int(time.time() * 1000)
	if heartbeat_value.get('v') != most_recent_heard:
		most_recent_heard = heartbeat_value.get('v')
		most_recent_beat = most_recent_heard + current_time
		print('heard new heartbeat: ' + str(most_recent_beat))
		updated_this_cycle = True
  	
	most_recent_check = most_recent_heard + current_time
	
 	#used for debugging
	if not updated_this_cycle:
		timediff = int(allowed_flatline_time_ms - (most_recent_check - most_recent_beat))
		print('checked for heartbeat but didn\'t hear it. will stop wheels if don\'t hear another beat in ~' + str(timediff) + ' ms')
 
	if (most_recent_check - most_recent_beat) > allowed_flatline_time_ms:
		if wheel_stop_sent:
			time.sleep(time_between_listens_ms / 1000)
		else:
			try:
				print('sending stop command to wheels after not hearing heartbeat')
				time_before_req = int(time.time() * 1000)
				r = requests.get('http://localhost:8080/wheel_command', json={
					"left": 90, "right": 90
				}, timeout=1)
				wheel_stop_sent = True
				time_after_req = int(time.time() * 1000)
				time_difference = time_after_req - time_before_req
				if time_difference <= time_between_listens_ms:
					time.sleep((time_between_listens_ms - time_difference) / 1000)
			except:
				print('failed to send stop to wheels')
				wheel_stop_sent = False
				time.sleep(time_between_listens_ms / 1000)
	else:
		wheel_stop_sent = False
		time.sleep(time_between_listens_ms / 1000)