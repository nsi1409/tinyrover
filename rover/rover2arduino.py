import serial
import atexit

def exit_handler_wheels():
    ser.flush() #flushes and closes on exit
    ser.close()

def setup_wheels():
	# ser = serial.Serial('/dev/cu.usbmodem2101', 9600, timeout=1) #Maybe good for linux stuff
	# ser = serial.Serial('COM3', 9600, timeout=1) #Windows 
	ser = serial.Serial()
	ser.setDTR(False)
	ser.port = 'COM4'
	ser.baudrate = 9600
	ser.timeout = 5
	ser.bytesize = serial.EIGHTBITS
	ser.stopbits = serial.STOPBITS_ONE
	ser.parity =serial.PARITY_NONE
	ser.close()
	ser.open()
	atexit.register(exit_handler_wheels)

def test_both_wheels():
    # print(ser.is_open) #confirms port is open
	data = [0,100,100] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	result = ser.read(3)
	print(result)
	print(result == bytesToSend) # Verify received same thing as sent

def test_right_wheels():
    # print(ser.is_open) #confirms port is open
	data = [2,100] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	result = ser.read(2)
	print(result)
	print(result == bytesToSend) # Verify received same thing as sent

def test_left_wheels():
	# print(ser.is_open) #confirms port is open
	data = [1,100] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	result = ser.read(2)
	print(result)
	print(result == bytesToSend) # Verify received same thing as sent

def test_left_wheels(speed):
	# print(ser.is_open) #confirms port is open
	data = [1,speed] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	result = ser.read(2)
	print(result)
	print(result == bytesToSend) # Verify received same thing as sent

def test_right_wheels(speed):
    # print(ser.is_open) #confirms port is open
	data = [2,speed] # Values from 0 - 255 allowed in each entry
	bytesToSend = bytes(data)
	print(bytesToSend)
	ser.write(bytesToSend)
	result = ser.read(2)
	print(result)
	print(result == bytesToSend) # Verify received same thing as sent



if __name__ == "__main__":
	print("commented out :)")
	# send2wheels(4, 7)
	# for i in range(10):
	# 	test_both_wheels()
	# 	test_left_wheels()
	# 	test_right_wheels()
