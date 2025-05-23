import time
from flask import Flask, request
import argparse
import requests
from math import sqrt, atan2, exp
from simple_pid import PID

parser = argparse.ArgumentParser()
parser.add_argument("-e", "--emulate", action="store_true")
options = parser.parse_args()

app = Flask(__name__)
err = None


@app.route("/ping", methods=["GET", "POST", "PUT"])
def pingpong():
    return "pong\n", 200


def no_connect():
    left = None
    right = None
    if request.data:
        left = request.json["left"]
        right = request.json["right"]
    return f"error: {err} | sent values: ({left}, {right})", 500


@app.route("/turn", methods=["GET", "POST", "PUT"])
def wheel_turn_both():
    target = 0
    if request.args:
        target = request.args["target"]
    if request.is_json:
        target = request.json["target"]
    target = float(target) % 360

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
    pid = PID(0.011, 0.0001, 0.00001, setpoint=target)
    pid.output_limits = (-1, 1)
    step = 0

    while True:
        r = requests.get(
            "http://127.0.0.1:5001/data", timeout=3, json={"k": "scuffed_yaw"}
        )
        yaw = float(r.json()["v"])
        yaw *= 180.0 / 3.14159265
        distance_right = (yaw - target) % 360
        distance_left = (target - yaw) % 360
        if distance_right > distance_left:
            distance = distance_left
        else:
            distance = -1 * distance_right

        if abs(distance) < 10:
            print("flag")
            r = requests.get("http://127.0.0.1:8080/wheel_command_stop", timeout=3)
            return str((yaw, target, distance, step))

        control = pid(distance)

        if distance >= 0:
            left = 90 - 90 * control
            right = 90 + 90 * control
        else:
            left = 90 + 90 * control
            right = 90 - 90 * control
        print("Distance: " + str(distance))
        print("Control: " + str(control))
        print("Direction: " + str(yaw))
        print("Left: " + str(left) + " Right: " + str(right))

        # These lines are redundant but included just to be safe
        left = min(160.0, max(20.0, left))
        right = min(160.0, max(20.0, right))
        r = requests.get(
            "http://127.0.0.1:8080/wheel_command_both",
            timeout=3,
            json={"left": int(left), "right": int(right)},
        )
        step += 1


@app.route("/drivestraight", methods=["GET", "POST", "PUT"])
def wheel_straight_both():
    target_time = 0
    velocity = 0
    if request.args:
        target_time = request.args["duration"]
        velocity = request.args["velocity"]
    if request.is_json:
        target_time = request.json["duration"]
        velocity = request.json["velocity"]
    target_time = max(0.0, float(target_time))
    velocity = max(-100.0, min(100.0, float(velocity)))
    start_time = time.time()
    elapsed_time = 0

    r = requests.get("http://127.0.0.1:5001/data", timeout=3, json={"k": "scuffed_yaw"})
    target_angle = r.json()["v"]

    while elapsed_time < target_time:
        r = requests.get(
            "http://127.0.0.1:5001/data", timeout=3, json={"k": "scuffed_yaw"}
        )
        yaw = r.json()["v"]
        distance_right = (yaw - target_angle) % 360
        distance_left = (target_angle - yaw) % 360
        if distance_right > distance_left:
            distance = distance_left
        else:
            distance = -1 * distance_right
        if abs(distance) > 5:
            r = requests.get("http://127.0.0.1:8080/wheel_command_stop", timeout=3)
            r = requests.get(
                "http://192.168.0.12:8081/turn",
                timeout=3,
                json={"target": target_angle},
            )
            target_time += time.time() - elapsed_time

        elapsed_time = time.time() - start_time
        control = max(45.0, min(135.0, (velocity * 90) + 90))
        r = requests.get(
            "http://127.0.0.1:8080/wheel_command_both",
            timeout=3,
            json={"left": int(control), "right": int(control)},
        )

    r = requests.get("http://127.0.0.1:8080/wheel_command_stop", timeout=3)
    return "ok"


@app.route("/directpath", methods=["GET", "POST", "PUT"])
def wheel_direct_both():
    target = [0, 0]
    if request.args:
        target[0] = request.args["lat"]
        target[1] = request.args["long"]
    if request.is_json:
        target[0] = request.json["lat"]
        target[1] = request.json["long"]

    target[0] = min(90.0, max(-90.0, float(target[0])))
    target[1] = min(180.0, max(-180.0, float(target[1])))

    r = requests.get("http://127.0.0.1:5001/data", timeout=3, json={"k": "gps"})
    location = r.json()["v"]

    distance = sqrt((target[0] - location[0]) ** 2 + (target[1] - location[1]) ** 2)

    while distance > 10:
        r = requests.get("http://127.0.0.1:5001/data", timeout=3, json={"k": "gps"})
        location = r.json()["v"]
        distance = sqrt((target[0] - location[0]) ** 2 + (target[1] - location[1]) ** 2)
        angle = atan2(target[0] - location[0], target[1] - location[1]) #Add something depending on which way north is on the IMU
        r = requests.get(
            "http://192.168.0.12:8081/turn", json={"target": angle}
        )
        r = requests.get(
            "http://127.0.0.1:8080/wheel_command_both",
            timeout=3,
            json={"left": 135, "right": 135},
        )

    return "ok"


@app.route("/path", methods=["GET", "POST", "PUT"])
def wheel_path_both():
    path = []
    if requests.args:
        path = requests.args["path"]
    if request.is_json:
        path = requests.json["path"]

    for pos in path:
        r = requests.get(
            "http://192.168.0.12:8081/directpath",
            json={"lat": pos[0], "long": pos[1]},
        )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081, debug=True, threaded=False, use_reloader=False)
