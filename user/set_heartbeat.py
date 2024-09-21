import sys
sys.path.append('../jetson')
import time
from kv import send_kv

while 1:
	send_kv('heartbeat', time.time())
