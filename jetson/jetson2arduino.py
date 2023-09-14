import serial
import atexit
import platform

class Messenger():
	def __init__(self):
		self.ser = serial.Serial()
		self.ser.setDTR(False)
		if platform.system() == 'Linux':
			self.ser.port = '/dev/ttyACM0'
		elif platform.system() == 'Darwin': # Darwin is MacOS
			self.ser.port = '/dev/cu.usbmodem2101'
		elif platform.system() == 'Windows':
			self.ser.port = 'COM4'
		self.ser.baudrate = 9600
		self.ser.timeout = 5
		self.ser.bytesize = serial.EIGHTBITS
		self.ser.stopbits = serial.STOPBITS_ONE
		self.ser.parity = serial.PARITY_NONE
		self.ser.close()
		self.ser.open()
		atexit.register(self.exit_handler_wheels)

	def exit_handler_wheels(self):
		self.ser.flush() #flushes and closes on exit
		self.ser.close()

	def send(self, data):
		#print(ser.is_open) #confirms port is open
		#data = [0,100,100] # Values from 0 - 255 allowed in each entry
		bytesToSend = bytes(data)
		print(bytesToSend)
		self.ser.write(bytesToSend)
		result = self.ser.read(3)
		print(result)
		print(result == bytesToSend) # Verify received same thing as sent

if __name__ == "__main__":
	J2A()
