from flask import Flask
import csv
import threading
import serial

# commit test

def parse(): 
    gps = serial.Serial("COM8", 4800)
    inpt = gps.readline()
    csv_inpt = inpt.decode('utf-8').splitlines()
    csv_parse = csv.reader(csv_inpt)
    parse_outp = list(csv_parse)
    return parse_outp

app = Flask(__name__)
parse_outp = parse()
north = 0
west = 0
coordinateList = []

def min2dec(inpt):
    if(inpt == ''):
        return "No"
    else:
        finpt = float(inpt)
        outp = (finpt // 100) + ((finpt%100)/60)
        return outp
    
def returnCord():
    coordinates = []
    if(parse_outp == [[]]):
        return
    elif(parse_outp[0][0] == "$GPGGA"):
        north = min2dec(parse_outp[0][2])
        west = min2dec(parse_outp[0][4])
        if(north =="No" or west =="No"):
            print(f'Lost Cords')
            return 
        coordinates.append(north)
        coordinates.append(west)
        return coordinates
    return
        


@app.route('/')
def getCord():
    global coordinateList
    return f'Coordinates: {coordinateList}'

def updateCord():
    global coordinateList
    global parse_outp
    while True:
        tempCoordinateList = returnCord()
        if(tempCoordinateList != None):
            coordinateList = tempCoordinateList
        parse_outp = parse()

t = threading.Thread(target=updateCord)
t.start()

if __name__ == '__main__':
    app.run()
