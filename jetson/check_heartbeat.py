import time
from kv import grab_kv
from kv import default_value
import requests

allowed_flatline_time_ms = 4500
time_between_listens_ms = 800

while 1:
    heartbeat_value = grab_kv('heartbeat')
    if(heartbeat_value == default_value):
        print('waiting for heartbeat...')
        time.sleep(time_between_listens_ms / 1000)
        continue
    last_heard_beat_time = heartbeat_value.get('v')
    print('last heard heartbeat at time ' + str(last_heard_beat_time))
    current_time = time.time() * 1000
    
    if (current_time - last_heard_beat_time) > allowed_flatline_time_ms:
        try:
            print('sending stop command to wheels after not hearing heartbeat')
            r = requests.get('http://localhost:8080/wheel_command', json={
            	"left": 90, "right": 90
            }, timeout=1)
        except:
            print('failed to send stop to wheels')
    
    time.sleep(time_between_listens_ms / 1000)
