import serial.tools.list_ports


def list_all():
	ports = serial.tools.list_ports.comports()
	for port in ports:
		print(port)
		print(port.hwid)
		print(port.vid)
		print(port.manufacturer)

def find(vid):
	ports = serial.tools.list_ports.comports()
	for port in ports:
		if port.vid == vid:
			return port.device
	raise Exception("device not detected")


if __name__ == '__main__':
	list_all()
