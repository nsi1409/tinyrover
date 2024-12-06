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
def wheel_call_both():
    target = 0
    if request.args:
        target = request.args['target']
    if request.is_json:
        target = request.json['target']
    target = float(target)

    pid = PID(1, 1, 1, setpoint=0)
    step = 0

    while True:
        r = requests.get('http://127.0.0.1:5001/brownsleep', timeout=5)
        yaw = r.json()[0]
        yaw = (180 * yaw) + 180
        distance_right = (yaw - target) % 360
        distance_left = (target - yaw) % 360
        if distance_right > distance_left:
            distance = distance_left
        else:
            distance = -1 * distance_right

        if abs(distance) < 2:
            return [yaw, target, distance, step]

        control = pid(distance)
        #r = requests.get('wheels server url', json={control values})
        step += 1



if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8081, debug = True, threaded = False, use_reloader = False)
