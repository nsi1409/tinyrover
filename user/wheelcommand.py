import requests
import time
import atexit
import argparse


def send2wheels_both(l, r):
    req = requests.get(
        "http://192.168.0.12:8080/wheel_command_both",
        timeout=3,
        json={"left": l, "right": r},
    )


def send2wheels_left(l):
    req = requests.get(
        "http://192.168.0.12:8080/wheel_command_left", timeout=3, json={"left": l}
    )


def send2wheels_right(r):
    req = requests.get(
        "http://192.168.0.12:8080/wheel_command_right", timeout=3, json={"right": r}
    )


def forward():
    print("going forward")
    while True:
        send2wheels_both(110, 110)
        time.sleep(0.4)


def left():
    print("going left")
    while True:
        send2wheels_both(90 - 20, 90 + 20)
        time.sleep(0.4)


def right():
    print("going right")
    while True:
        send2wheels_both(90 + 20, 90 - 20)
        time.sleep(0.4)


def backward():
    print("going backwards")
    while True:
        send2wheels_both(70, 70)
        time.sleep(0.4)


def trim(magnitude, trim, remote=True):
    print("trimming")
    if remote:
        uri = "http://192.168.0.12:8080/wheel_command_trim"
    else:
        uri = "http://localhost:8080/wheel_command_trim"
    while True:
        req = requests.get(uri, timeout=3, json={"magnitude": magnitude, "trim": trim})
        time.sleep(0.4)


def stop_wheels():
    print("program exited, stopping wheels")
    send2wheels_both(90, 90)


atexit.register(stop_wheels)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-forward", action="store_true")
    parser.add_argument("-left", action="store_true")
    parser.add_argument("-right", action="store_true")

    parser.add_argument("-backward", action="store_true")
    parser.add_argument("-left_trim", action="store_true")
    parser.add_argument("-right_trim", action="store_true")

    parser.add_argument("-stop", action="store_true")

    parser.add_argument("-smart_turn", action="store_true")
    parser.add_argument("-heading", type=float)

    parser.add_argument("-smart_straight", action="store_true")
    parser.add_argument("-duration", type=float)
    parser.add_argument("-speed", type=float)

    parser.add_argument("-smart_direct", action="store_true")
    parser.add_argument("-position", action="extend", nargs=2, type=float)

    parser.add_argument("-smart_path", action="store_true")

    # data coming in is in options
    options = parser.parse_args()

    if options.left:
        left()
    elif options.right:
        right()
    elif options.forward:
        forward()
    elif options.backward:
        backward()
    elif options.left_trim:
        trim(0.2, 0.8, remote=True)
    elif options.right_trim:
        trim(0.2, -0.8, remote=True)
    elif options.stop:
        req = requests.get("http://192.168.0.12:8080/wheel_command_stop", timeout=3)
    elif options.smart_turn:
        req = requests.get(
            "http://192.168.0.12:8081/turn", timeout=3, json={"target": options.heading}
        )
        time.sleep(10)
    elif options.smart_straight:
        req = requests.get(
            "http://192.168.0.12:8081/drivestraight",
            timeout=3,
            json={"duration": options.duration, "velocity": options.speed},
        )
        time.sleep(10)
    elif options.smart_direct:
        req = requests.get(
            "http://192.168.0.12:8081/directpath",
            timeout=3,
            json={"target": options.position[0:2]},
        )
        time.sleep(10)
    elif options.smart_path:
        req = requests.get(
            "http://192.168.0.12:8081/path",
            timeout=3,
            json={
                "path": [
                    [
                        options.position[i : i + 2] for i in range(0, len(options.position), 2)
                    ]
                ]
            },
        )
        time.sleep(10)
