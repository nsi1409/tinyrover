from flask import Flask
# from turbo_flask import Turbo
import time
import serial
import csv
import sys

def parse(): 
    gps = serial.Serial("COM8", 4800)
    inpt = gps.readline()
    csv_inpt = inpt.decode('utf-8').splitlines()
    csv_parse = csv.reader(csv_inpt)
    parse_outp = list(csv_parse)
    return parse_outp

app = Flask(__name__)
# turbo = Turbo(app)
# gps = serial.Serial("COM5", baudrate=4800, xonxoff=0,rtscts=0,bytesize=8,stopbits=1,parity=serial.PARITY_NONE)
parse_outp = parse()

north = 0
west = 0


def min2dec(inpt):
    if(inpt == ''):
        return "No"
    else:
        finpt = float(inpt)
        outp = (finpt // 100) + ((finpt%100)/60)
        return outp


def returnCord():
    # print(parse_outp)
    # print(f'Stuff{parse_outp[0][0]}')
    if(parse_outp == [[]]):
        return
    elif(parse_outp[0][0] == "$GPGGA"):
        # print(f'This is GPGGA')
        north = min2dec(parse_outp[0][2])
        west = min2dec(parse_outp[0][4])
        # print(f'North is {north}')
        # print(f'West is {west}')
        if(north =="No" or west =="No"):
            print(f'Lost Cords')
            return
        print(f'North is {north}')
        print(f'West is {west}')

while(1): 
    returnCord()
    parse_outp = parse()
    # time.sleep(1)
    
@app.route('/gps', methods=['GET'])
def trial():
    # if(parse_outp[0][0] == "$GPGGA"):
    #     print(f'This is GPGGA')
    #     print(parse_outp)
    #     north = min2dec(parse_outp[0][2])
    #     west = min2dec(parse_outp[0][4])
    #     print(f'North is {north}')
    #     print(f'West is {west}')



    return 'North is' + north + 'West is' + west


if __name__ == '__main__':
   app.run()