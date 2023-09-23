import serial.tools.list_ports

def find(manufacturer):
    ports = serial.tools.list_ports.comports()
    print(ports)
    for port in ports:
        print(port.manufacturer)

find('')
