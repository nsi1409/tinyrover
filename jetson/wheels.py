from flask import Flask, request
import jetson2arduino
import argparse
import time
from flask_cors import CORS, cross_origin
import requests
import atexit

parser = argparse.ArgumentParser()
parser.add_argument("-e", "--emulate", action="store_true")
options = parser.parse_args()

app = Flask(__name__)
err = None
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


try:
    j2a = jetson2arduino.Messenger()
    print("successful connect to arduino")
except Exception as e:
    print("failed to connect to arduino:")
    print(e)


@app.route("/ping", methods=["GET", "POST", "PUT"])
@cross_origin()
def pingpong():
    return "pong\n", 200


@app.route("/wheel_command", methods=["GET", "POST", "PUT"])
@app.route("/wheel_command_both", methods=["GET", "POST", "PUT"])
@cross_origin()
def wheel_both():
    json = request.json
    left = json["left"]
    right = json["right"]
    msg = f"left: {left}, right: {right}"
    print(msg)
    clampedLeft = min(180, max(0, int(left)))
    clampedRight = min(180, max(0, int(right)))
    j2a.send_both(clampedLeft, clampedRight)
    return "ok", 200


@app.route("/wheel_command_stop", methods=["GET", "POST", "PUT"])
@cross_origin()
def wheel_stop():
    left = 90
    right = 90
    msg = f"left: {left}, right: {right}"
    print(msg)
    j2a.send_both(left, right)
    return "ok", 200


@app.route("/wheel_command_trim", methods=["GET", "POST", "PUT"])
@cross_origin()
def wheel_trim():
    json = request.json
    trim = json["trim"]
    magnitude = json["magnitude"]
    magnitude = float(magnitude)
    trim = float(trim)
    assert magnitude >= -1
    assert magnitude <= 1
    if trim > 0:
        right = (90 * magnitude) + 90
        left = (90 * (magnitude * (1 - trim))) + 90
    else:
        left = (90 * magnitude) + 90
        right = (90 * (magnitude * (1 - ((-1) * trim)))) + 90
    left = min(180, max(0, int(left)))
    right = min(180, max(0, int(right)))
    msg = f"trim drive left: {left}, right: {right}"
    print(msg)
    j2a.send_both(left, right)
    return "ok", 200


@app.route("/wheel_command_left", methods=["GET", "POST", "PUT"])
@cross_origin()
def wheel_left():
    json = request.json
    left = json["left"]
    j2a.send_left(min(180, max(0, int(left))))
    return "ok", 200


@app.route("/wheel_command_right", methods=["GET", "POST", "PUT"])
@cross_origin()
def wheel_right():
    json = request.json
    right = json["right"]
    j2a.send_right(min(180, max(0, int(right))))
    return "ok", 200


def stop_on_start():
    while True:
        try:
            req = requests.get(
                "http://localhost:8080/wheel_command",
                timeout=10,
                json={"left": 90, "right": 90},
            )
            if req.ok:
                break
        except:
            print("timeout")
        time.sleep(0.1)


def exit_handler():
    j2a.send_both(90, 90)
    time.sleep(0.2)
    j2a.send_both(90, 90)


atexit.register(exit_handler)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True, threaded=False, use_reloader=False)
