import sys
sys.path.append('../jetson')
import time
from kv import send_kv

heartbeat_send_interval_ms = 400

while 1:
	send_kv('heartbeat', int(time.time() * 1000), location='remote')
	time.sleep(heartbeat_send_interval_ms / 1000)
