from flask import Flask
import serial
import csv
import sys

app = Flask(__name__)
gps = serial.Serial("/dev/ttyUSB1", baudrate=4800, xonxoff=0,rtscts=0,bytesize=8,stopbits=1,parity=serial.PARITY_NONE)

inpt = gps.readline()
csv_inpt = inpt.decode('utf-8').splitlines()
csv_parse = csv.reader(csv_inpt)
parse_outp = list(csv_parse)

def min2dec(inpt):
	finpt = float(inpt)
	outp = (finpt // 100) + ((finpt%100)/60)
	return outp



@app.route('/gps', methods=['GET'])
def returnCord():
    if(parse_outp[0][0] == "$GPGGA"):
        while(1):
            north = min2dec(parse_outp[0][2])
            west = -1 * min2dec(parse_outp[0][4])
            print(f'North is {north}')
            print(f'West is {west}')

    return 'Hello World'


if __name__ == '__main__':
   app.run()