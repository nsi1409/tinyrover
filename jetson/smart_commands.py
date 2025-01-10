import time
from flask import Flask, request
import argparse
import requests
from simple_pid import PID

parser = argparse.ArgumentParser()
parser.add_argument('-e', '--emulate', action='store_true')
options = parser.parse_args()

app = Flask(__name__)
err = None


@app.route('/ping', methods=['GET', 'POST', 'PUT'])
def pingpong():
	return 'pong\n', 200


def no_connect():
	left = None
	right = None
	if request.data:
		left = request.json['left']
		right = request.json['right']
	return f'error: {err} | sent values: ({left}, {right})', 500


@app.route('/turn', methods=['GET', 'POST', 'PUT'])
def wheel_turn_both():
    target = 0
    if request.args:
        target = request.args['target']
    if request.is_json:
        target = request.json['target']
    target = float(target)

    """
    Notes for PID outputs:
    
    Kp shouldn't be more than 1/(max error)
    Start with a very small Ki/Kd
    
    Tuning method 1:
    Let Kd be 0, increase Kp until just slightly undershooting,
    increase Ki until perfect
    
    Tuning method 2:
    Let Ki be 0, increase Kp until just slightly overshooting,
    increase Kd until perfect
    """
    pid = PID(.0001, 0, 0, setpoint=target)
    pid.output_limits = (0, 180)
    step = 0

    while True:
        r = requests.get('http://127.0.0.1:5001/data', timeout=3, json={'k': 'scuffed_yaw'})
        yaw = r.json()['v']
        distance_right = (yaw - target) % 360
        distance_left = (target - yaw) % 360
        if distance_right > distance_left:
            distance = distance_left
        else:
            distance = -1 * distance_right

        if abs(distance) < 5:
            r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)
            return [yaw, target, distance, step]

        control = pid(distance)

        if distance >= 0:
            left = 135 - (.5 * control)
            right = 135
        else:
            left = 135
            right =  135 - (.5 * control)

        #These lines are redundant but included just to be safe
        left = min(135, max(45, left))
        right = min(135, max(45, right))

        r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': int(left), 'right': int(right)})
        step += 1

@app.route('/drivestraight', methods=['GET', 'POST', 'PUT'])
def wheel_straight_both():
    target_time = 0
    velocity = 0
    if request.args:
        target_time = request.args['time']
        velocity = request.args['velocity']
    if request.is_json:
        target_time = request.json['time']
        velocity = request.json['velocity']
    target_time = float(target_time)
    start_time = time.time()
    elapsed_time = 0

    r = requests.get('http://127.0.0.1:5001/data', timeout=3, json={'k': 'scuffed_yaw'})
    target_angle = r.json()['v']

    while elapsed_time < target_time:
        r = requests.get('http://127.0.0.1:5001/data', timeout=3, json={'k': 'scuffed_yaw'})
        yaw = r.json()['v']
        distance_right = (yaw - target_angle) % 360
        distance_left = (target_angle - yaw) % 360
        if distance_right > distance_left:
            distance = distance_left
        else:
            distance = -1 * distance_right
        if abs(distance) > 5:
            r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)
            r = requests.get('http://192.168.0.12:8081/turn', timeout=3, json={"target": target_angle})
            target_time += (time.time() - elapsed_time)
        
        elapsed_time = time.time() - start_time
        control = max(45, min(135, (velocity * 90) + 90))
        r = requests.get('http://127.0.0.1:8080/wheel_command_both', timeout=3, json={'left': int(control), 'right': int(control)})
        
    r = requests.get('http://127.0.0.1:8080/wheel_command_stop', timeout=3)

        

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8081, debug = True, threaded = False, use_reloader = False)
