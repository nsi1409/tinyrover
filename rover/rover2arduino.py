import serial
import time
import atexit

class Controller:
	def __init__(self):
		self.ser = serial.Serial()
		self.ser.setDTR(False)
		self.ser.port = 'COM3'
		self.ser.baudrate = 9600
		self.ser.timeout = 5
		self.ser.bytesize = serial.EIGHTBITS
		self.ser.stopbits = serial.STOPBITS_ONE
		self.ser.parity =serial.PARITY_NONE
		self.ser.close()
		self.ser.open()
		# ser = serial.Serial('/dev/cu.usbmodem2101', 9600, timeout=1) #Maybe good for linux stuff
		# ser = serial.Serial('COM3', 9600, timeout=1) #Windows 

	def exit_handler():
		self.ser.flush() #flushes and closes on exit
		self.ser.close()

	def send2wheels():
		print(ser.is_open) #confirms port is open
		data = [1,2,3,4,5,6,7,8] # Values from 0 - 255 allowed in each entry
		bytesToSend = bytes(data)
		print(bytesToSend)
		ser.write(bytesToSend)
		result = ser.read(8)
		print(result)
		print(result == bytesToSend) # Verify received same thing as sent

if __name__ == "__main__":
	controller = Controller()
	atexit.register(controller.exit_handler)
	controller.send2wheels()
