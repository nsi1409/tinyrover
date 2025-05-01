from enum import Enum
import sys
import os
import pygame

# import wheelcommand as wc
import threading
from pygame.locals import *
import requests

pygame.init()
pygame.joystick.init()
controllers = [pygame.joystick.Joystick(i) for i in range(pygame.joystick.get_count())]

leftStickMotion = [0.0, 0.0]
rightStickMotion = [0.0, 0.0]
rightTrigger = 0.0
leftTrigger = 0.0
btnA = False
btnB = False
btnX = False
btnY = False
btnLB = False
btnRB = False

leftSpeed = 90
rightSpeed = 90


class PyGameBtn(Enum):
    A = 0
    B = 1
    X = 2
    Y = 3
    LB = 4
    RB = 5
    BACK = 6
    START = 7
    LEFTTHUMB = 8
    RIGHTTHUMB = 9
    XBOX = 10
    SHARE = 11


def printConnectedControllers():
    print("Connected controllers:")
    for controller in controllers:
        print("- " + str(controller.get_name()))


def ignoreInputsSmallerThan(magnitude):
    global rightTrigger, leftTrigger

    for i in range(len(leftStickMotion)):
        if abs(leftStickMotion[i]) < magnitude:
            leftStickMotion[i] = 0.0

    for i in range(len(rightStickMotion)):
        if abs(rightStickMotion[i]) < magnitude:
            rightStickMotion[i] = 0.0

    if abs(rightTrigger) < magnitude:
        rightTrigger = 0.0

    if abs(leftTrigger) < magnitude:
        leftTrigger = 0.0


def handleButtonRelease(event):
    global btnA, btnB, btnX, btnY, btnLB, btnRB
    match event.button:
        case PyGameBtn.A.value:
            btnA = False
        case PyGameBtn.B.value:
            btnB = False
        case PyGameBtn.X.value:
            btnX = False
        case PyGameBtn.Y.value:
            btnY = False
        case PyGameBtn.LB.value:
            btnLB = False
        case PyGameBtn.RB.value:
            btnRB = False
        case (
            PyGameBtn.BACK.value,
            PyGameBtn.START.value,
            PyGameBtn.XBOX.value,
            PyGameBtn.LEFTTHUMB.value,
            PyGameBtn.RIGHTTHUMB.value,
        ):
            print(str(event.button) + "released (not mapped to a function)")


def handleButtonPress(event):
    global btnA, btnB, btnX, btnY, btnLB, btnRB
    match event.button:
        case PyGameBtn.A.value:
            btnA = True
        case PyGameBtn.B.value:
            btnB = True
        case PyGameBtn.X.value:
            btnX = True
        case PyGameBtn.Y.value:
            btnY = True
        case PyGameBtn.LB.value:
            btnLB = True
        case PyGameBtn.RB.value:
            btnRB = True
        case PyGameBtn.XBOX.value:
            handleQuit()
        case (
            PyGameBtn.BACK.value,
            PyGameBtn.START.value,
            PyGameBtn.LEFTTHUMB.value,
            PyGameBtn.RIGHTTHUMB.value,
        ):
            print(str(event.button) + "pressed (not mapped to a function)")


def normalizeTriggerValues():
    global rightTrigger, leftTrigger
    leftTrigger = (leftTrigger + 1) / 2
    rightTrigger = (rightTrigger + 1) / 2


def handleJoyAxisMotion(event):
    global rightTrigger, leftTrigger

    match event.axis:
        case 0:
            leftStickMotion[0] = event.value
        case 1:
            leftStickMotion[1] = event.value
        case 2:
            rightStickMotion[0] = event.value
        case 3:
            rightStickMotion[1] = event.value
        # case 4:
        #     leftTrigger = event.value
        # case 5:
        #     rightTrigger = event.value


def updateJoysticks(event):
    global controllers
    controllers = [
        pygame.joystick.Joystick(i) for i in range(pygame.joystick.get_count())
    ]
    printConnectedControllers()


def handleQuit(event):
    pygame.quit()
    sys.exit()


def getControllerInput():
    global leftTrigger, rightTrigger
    for event in pygame.event.get():
        match event.type:
            case pygame.JOYBUTTONDOWN:
                handleButtonPress(event)
            case pygame.JOYBUTTONUP:
                handleButtonRelease(event)
            # case pygame.JOYAXISMOTION:
            #     handleJoyAxisMotion(event)
            case pygame.JOYDEVICEADDED, pygame.JOYDEVICEREMOVED:
                updateJoysticks(event)
            case pygame.QUIT:
                handleQuit(event)

    leftTrigger = pygame.joystick.Joystick(0).get_axis(4)
    rightTrigger = pygame.joystick.Joystick(0).get_axis(5)


def setWheelSpeedsBasedOnControllerInput():
    global leftSpeed, rightSpeed

    if rightTrigger > 0:
        baseSpeed = 90 + (rightTrigger * 90)
        leftSpeed = baseSpeed + (leftStickMotion[0] * 45)
        rightSpeed = baseSpeed - (leftStickMotion[0] * 45)
        if leftStickMotion[0] < 0:
            leftSpeed += 1
    elif leftTrigger > 0:
        baseSpeed = 90 - (leftTrigger * 90)
        leftSpeed = baseSpeed - (leftStickMotion[0] * 45)
        rightSpeed = baseSpeed + (leftStickMotion[0] * 45)
    else:
        leftSpeed = 90 + (leftStickMotion[0] * 60)
        rightSpeed = 90 - (leftStickMotion[0] * 60)
        if leftStickMotion[0] < 0:
            leftSpeed += 1

    leftSpeed = int(leftSpeed)
    rightSpeed = int(rightSpeed)

    # print(str(leftSpeed) + ", " + str(rightSpeed))


def updateWheels():
    global leftSpeed
    global rightSpeed

    l = leftSpeed
    r = rightSpeed
    print("sending " + str(l) + ", " + str(r) + "...")
    try:
        req = requests.get(
            url="http://192.168.0.12:8080/wheel_command_both",
            timeout=4,
            json={"left": l, "right": r},
            headers={"Connection": "close"},
        )
        print("sent " + str(l) + ", " + str(r))
    except Exception as e:
        print("failed to send " + str(l) + ", " + str(r))
        print(e)


if __name__ == "__main__":
    printConnectedControllers()
    while True:
        getControllerInput()
        ignoreInputsSmallerThan(0.05)
        normalizeTriggerValues()
        setWheelSpeedsBasedOnControllerInput()
        updateWheels()
        pygame.time.wait(400)
