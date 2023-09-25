import serial.tools.list_ports


def list_all():
	ports = serial.tools.list_ports.comports()
	for port in ports:
		print(port.manufacturer)


def find(manufacturer):
	ports = serial.tools.list_ports.comports()
	for port in ports:
		if port.manufacturer == manufacturer:
			return port.device
	raise Exception("device not detected")


if __name__ == '__main__':
	list_all()
	print(find('Prolific Technology Inc. '))
