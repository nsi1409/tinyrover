import sys
import pygame
import os
import wheelcommand as wc
import argparse
os.environ["SDL_JOYSTICK_ALLOW_BACKGROUND_EVENTS"] = "1" #This allows the window to be unselected but still get controller input
import requests

import threading

default_antenna_ip = "192.168.1.10" # This may change over time
default_rovernet_ip = "192.168.0.12" # This may change over time

# def printit():
#   threading.Timer(5.0, printit).start()
#   print "Hello, World!"

# printit()

from pygame.locals import *
pygame.init()
pygame.display.set_caption('game base')
screen = pygame.display.set_mode((1, 1), pygame.NOFRAME)
clock = pygame.time.Clock()

pygame.joystick.init()
joysticks = [pygame.joystick.Joystick(i) for i in range(pygame.joystick.get_count())]
for joystick in joysticks:
    print(joystick.get_name())

motion = [0, 0, 0, 0]

speedMultiplier = 1

leftSpeed = 90
rightSpeed = 90

def updateWheels():
    global leftSpeed
    global rightSpeed
    wc.send2wheels_both(leftSpeed, rightSpeed)
    threading.Timer(0.1, updateWheels).start()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument("--indoor",action='store_true')
    args = parser.parse_args()
    if args.indoor:
        wc.set_active_ip(default_rovernet_ip)
        print("Indoor mode")
    else:
        wc.set_active_ip(default_antenna_ip)
        print("Outdoor mode")

    updateWheels()

    while True:
        #This prevents minimal/unintended input from moving the rover
        if abs(motion[0]) < 0.1:
            motion[0] = 0
        if abs(motion[1]) < 0.1:
            motion[1] = 0
        if abs(motion[2]) < 0.1:
            motion[2] = 0
        if abs(motion[3]) < 0.1:
            motion[3] = 0

        # Check for controller input
        for event in pygame.event.get():
            if event.type == JOYBUTTONDOWN:
                print(str(event) + " " + str(speedMultiplier))
                #Increase or decrease speed multiplier if a shoulder button is hit
                if event.button == 4:
                    if speedMultiplier > 1:
                        speedMultiplier -= 2 # Was originally -3 but Andrew changed to -2 cuz motors zooming
                if event.button == 5:
                    if speedMultiplier < 10:
                        speedMultiplier += 2 # Was originally 3 but Andrew changed to 2 cuz motors zooming
            if event.type == JOYBUTTONUP:
                print(event)
            if event.type == JOYAXISMOTION:
                print(event)
                if event.axis < 2:
                    motion[event.axis] = event.value
                if event.axis == 3:
                    motion[3] = event.value
                elif event.axis > 3 and event.axis < 5:
                    motion[event.axis-1] = event.value
                # print(speedMultiplier)
                # print(motion)
                leftSpeed = int((-motion[1]*speedMultiplier*9)+90)
                rightSpeed = int((-motion[3]*speedMultiplier*9)+90)
                print(leftSpeed)
                print(rightSpeed)

            if event.type == JOYDEVICEADDED:
                joysticks = [pygame.joystick.Joystick(i) for i in range(pygame.joystick.get_count())]
                for joystick in joysticks:
                    print(joystick.get_name())
            if event.type == JOYDEVICEREMOVED:
                joysticks = [pygame.joystick.Joystick(i) for i in range(pygame.joystick.get_count())]
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            if event.type == KEYDOWN:
                if event.key == K_ESCAPE:
                    pygame.quit()
                    sys.exit()

        # clock.tick(10)
