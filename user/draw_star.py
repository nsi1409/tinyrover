import requests
import argparse
from math import sin, pi
from time import sleep

parser = argparse.ArgumentParser()
parser.add_argument('-five_sided', action='store_true')
parser.add_argument('-n', type=int)
parser.add_argument('-r', type=float)
options = parser.parse_args()

def five_sided():
    distance = 2 * options.r * sin(72 * pi / 180)

    yaw = 0
    r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": 0})
    r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': 135, 'right': 135})
    sleep(.1 * options.r)
    r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)

    yaw = 162
    r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": yaw})

    for i in range(5):
        r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': 135, 'right': 135})
        sleep(.1 * distance)
        r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)
        yaw += 144
        yaw %= 360
        r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": yaw})

def n_sided():
    interior_angle = 180 / options.n
    exterior_angle = interior_angle * (options.n - 2)
    distance = (options.r * sin(pi/options.n)) / sin((exterior_angle / 2) * pi / 180)

    yaw = 0
    r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": 0})
    r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': 135, 'right': 135})
    sleep(.1 * options.r)
    r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)

    yaw += (180 - exterior_angle) / 2
    yaw %= 360

    r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": yaw})

    for i in range(options.n):
        r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': 135, 'right': 135})
        sleep(.1 * distance)
        r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)

        yaw += (180 + exterior_angle)
        yaw %= 360
        r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": yaw})

        r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': 135, 'right': 135})
        sleep(.1 * distance)
        r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)

        yaw += (180 - interior_angle)
        yaw %= 360
        r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": yaw})


if __name__ == '__main__':
    if options.five_sided:
        five_sided()
    elif options.n >= 5:
        n_sided()