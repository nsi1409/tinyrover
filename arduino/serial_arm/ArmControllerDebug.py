import pygame
import serial
import time
from pygame.locals import *
from inputs import get_gamepad

#This code was formed according to this tutorial: https://projecthub.arduino.cc/ansh2919/serial-communication-between-python-and-arduino-663756
#The purpose of this script is to verify serial communication from the computer to the teensy
#Entering a number of milliseconds should affect th blinking rate of the teensy
#Upload the corresponding Arduino code on the teensy befor launching this script.


pygame.init()
pygame.display.set_caption('game base')
screen = pygame.display.set_mode((1, 1), pygame.NOFRAME)
clock = pygame.time.Clock()
joystick = pygame.joystick.Joystick(0)

ser = serial.Serial()
ser.setDTR(False)
ser.port = 'COM5' #change this COM to match the one specified in Arduino
ser.baudrate = 9600 #This number should match the one specified in arduino
ser.timeout = 1
ser.bytesize = serial.EIGHTBITS
ser.stopbits = serial.STOPBITS_ONE
ser.parity =serial.PARITY_NONE
ser.close()
ser.open()

def write_read(x):
    ser.write(bytes(x,  'utf-8'))
    time.sleep(0.01)
    data = ser.readline()
    return  data


while True:
    # num = input("Enter a number: ")
    events = get_gamepad()
    for event in events:
        # print(event.code, event.state)
        if event.code == 'BTN_TR' and event.state != 0: #A button
            value  = write_read("61") #joint 6 forward
        elif event.code == 'BTN_TL' and event.state != 0:
            value  = write_read("60")
        elif event.code == 'BTN_WEST' and event.state != 0:
            value  = write_read("50")
        elif event.code == 'BTN_EAST' and event.state != 0:
            value  = write_read("51")
        elif event.code == 'BTN_NORTH' and event.state != 0:
            value  = write_read("40")
        elif event.code == 'BTN_SOUTH' and event.state != 0:
            value  = write_read("41")
        elif event.code == 'ABS_RY' and event.state > 0:
            value  = write_read("31")
        elif event.code == 'ABS_RY' and event.state < 0:
            value  = write_read("30")
        elif event.code == 'ABS_Y' and event.state > 0:
            value  = write_read("21")
        elif event.code == 'ABS_Y' and event.state < 0:
            value  = write_read("20")
        elif event.code == 'ABS_HAT0X' and event.state > 0:
            value  = write_read("11")
        elif event.code == 'ABS_HAT0X' and event.state < 0:
            value  = write_read("10")
        elif event.code != 'SYN_REPORT' and event.state == 0:
            value  = "0"
            write_read(value)
            # print(event.ev_type, event.code, event.state)

    # for event in pygame.event.get():
        # print("under the event")
        # if event.type == QUIT:
        #     pygame.quit()
        #     sys.exit()
        # if event.type == KEYDOWN:
        #     value = "Not an arm key"
        #     if event.key == K_1:
        #         value  = write_read("11") #joint 1 forward
        #     if event.key == K_q:
        #         value  = write_read("10") #joint 1 backward
        #     if event.key == K_2:
        #         value  = write_read("21") #joint 2 forward
        #     if event.key == K_w:
        #         value  = write_read("20") #joint 2 backward
        #     if event.key == K_3:
        #         value  = write_read("31") #joint 3 forward
        #     if event.key == K_e:
        #         value  = write_read("30") #joint 3 backward
        #     if event.key == K_4:
        #         value  = write_read("41") #joint 4 forward
        #     if event.key == K_r:
        #         value  = write_read("40") #joint 4 backward
        #     if event.key == K_5:
        #         value  = write_read("51") #joint 5 forward
        #     if event.key == K_t:
        #         value  = write_read("50") #joint 5 backward
            
        #     print(value)
        # if event.type == KEYUP:
        #     value  = write_read("0")
        #     print("UPPP")
        # else:
        #     print(joystick.get_button(0))

    # if joystick.get_instance_id()==None:
    # print(joystick.get_instance_id())
    
        # if joystick.get_button(0) == 1: #A button
        #     value  = write_read("61") #joint 6 forward
        # if joystick.get_button(1) == 1: #B button
        #     value  = write_read("60") #joint 6 backward
        # if joystick.get_button(2) == 1: #X button until we have a better solution
        #     value  = write_read("0") #joint 6 backward
