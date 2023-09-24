import serial
import atexit
import platform


class Messenger():
	def __init__(self):
		self.ser = serial.Serial()
		self.ser.setDTR(False)
		if platform.system() == 'Linux':
			self.ser.port = '/dev/ttyACM0'
		elif platform.system() == 'Darwin':  # Darwin is MacOS
			self.ser.port = '/dev/cu.usbmodem1301'
		elif platform.system() == 'Windows':
			self.ser.port = 'COM4'
		self.ser.baudrate = 9600
		self.ser.timeout = 5
		self.ser.bytesize = serial.EIGHTBITS
		self.ser.stopbits = serial.STOPBITS_ONE
		self.ser.parity = serial.PARITY_NONE
		self.ser.close()
		self.ser.open()
		#atexit.register(self.exit_handler_wheels)
		#assert self.ser.is_open

	def exit_handler_wheels(self):
		self.ser.flush()  #flushes and closes on exit
		self.ser.close()
###

	def send_right(self, speed):
		data = [2, speed]
		#data = [2,100,100] # Values from 0 - 255 allowed in each entry
		bytesToSend = bytes(data)
		print(bytesToSend)
		self.ser.write(bytesToSend)
		#result = self.ser.read(3)
		#print(result)
		#print(result == bytesToSend) # Verify received same thing as sent

	def send_left(self, speed):
		data = [1, speed]
		#data = [1,100,100] # Values from 0 - 255 allowed in each entry
		bytesToSend = bytes(data)
		print(bytesToSend)
		self.ser.write(bytesToSend)
		#result = self.ser.read(3)
		#print(result)
		#print(result == bytesToSend) # Verify received same thing as sent

	def send_both(self, left_speed, right_speed):
		data = [0, left_speed, right_speed]
		#data = [0,100,100] # Values from 0 - 255 allowed in each entry
		bytesToSend = bytes(data)
		print(bytesToSend)
		self.ser.write(bytesToSend)
		#result = self.ser.read(3)
		#print(result)
		#print(result == bytesToSend) # Verify received same thing as sent


###
if __name__ == "__main__":
	j2a = Messenger()
	#while(1):
	#j2a.send([0, 90, 90])
	for i in range(200):
		#j2a.send([0, 120, 120])
		j2a.send([0, 90, 90])
	#j2a.send([0, 100, 100])
