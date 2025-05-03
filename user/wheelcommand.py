import requests
import time
import atexit
import argparse


def handleCommand(route, json, remote=True, smart=False, message=None, sleepTime=0):
    if message is not None:
        print(message)

    if remote:
        endpoint = "192.168.0.12"
    else:
        endpoint = "localhost"

    if smart:
        port = "8081"
    else:
        port = "8080"

    req = requests.get(
        f"http://{endpoint}:{port}/{route}",
        timeout=3,
        json=json,
    )

    if sleepTime > 0:
        time.sleep(sleepTime)


def stopWheelsOnExit():
    handleCommand(
        "wheel_command_both",
        {"left": 90, "right": 90},
        message="program exited, stopping wheels",
    )


atexit.register(stopWheelsOnExit)

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

    options = parser.parse_args()

    if options.left:
        handleCommand(
            "wheel_command_both",
            {"left": 70, "right": 110},
            message="going left",
            sleepTime=60,
        )
    elif options.right:
        handleCommand(
            "wheel_command_both",
            {"left": 110, "right": 70},
            message="going right",
            sleepTime=60,
        )
    elif options.forward:
        handleCommand(
            "wheel_command_both",
            {"left": 110, "right": 110},
            message="going forward",
            sleepTime=60,
        )
    elif options.backward:
        handleCommand(
            "wheel_command_both",
            {"left": 70, "right": 70},
            message="going backwards",
            sleepTime=60,
        )
    elif options.left_trim:
        handleCommand(
            "wheel_command_trim",
            {"magnitude": 0.2, "trim": 0.8},
            message="trimming",
            sleepTime=60,
        )
    elif options.right_trim:
        handleCommand(
            "wheel_command_trim",
            {"magnitude": 0.2, "trim": -0.8},
            message="trimming",
            sleepTime=60,
        )
    elif options.stop:
        handleCommand("wheel_command_stop", {})
    elif options.smart_turn:
        handleCommand("turn", {"target": options.heading}, smart=True, sleepTime=10)
    elif options.smart_straight:
        handleCommand(
            "drivestraight",
            {"duration": options.duration, "velocity": options.speed},
            smart=True,
            sleepTime=10,
        )
    elif options.smart_direct:
        handleCommand(
            "directpath", {"target": options.position[0:2]}, smart=True, sleepTime=10
        )
    elif options.smart_path:
        handleCommand(
            "path",
            {
                "path": [
                    [
                        options.position[i : i + 2]
                        for i in range(0, len(options.position), 2)
                    ]
                ]
            },
            smart=True,
            sleepTime=10,
        )
