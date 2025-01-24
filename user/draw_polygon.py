import requests
import argparse
from math import sin, pi
from time import sleep

parser = argparse.ArgumentParser()
parser.add_argument('-n', type=int)
parser.add_argument('-r', type=float)
options = parser.parse_args()

if __name__ == '__main__':
    angle = (180 * (options.n - 2)) / options.n
    distance = options.r * 2 * sin(pi/options.n)

    yaw = 0
    r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": 0})
    r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': 135, 'right': 135})
    sleep(.1 * options.r)
    r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)
    yaw += (180 - .5 * angle)
    yaw %= 360
    r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": yaw})

    for i in range(options.n):
        r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': 135, 'right': 135})
        sleep(.1 * options.r)
        r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)
        yaw += (180 - angle)
        yaw %= 360
        r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": yaw})