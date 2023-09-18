import sys
import pygame
import WheelCommandDebug as WCD

from pygame.locals import *
pygame.init()
pygame.display.set_caption('game base')
screen = pygame.display.set_mode((500, 500), 0, 32)
clock = pygame.time.Clock()

pygame.joystick.init()
joysticks = [pygame.joystick.Joystick(i) for i in range(pygame.joystick.get_count())]
for joystick in joysticks:
    print(joystick.get_name())

# my_square = pygame.Rect(50, 50, 50, 50)
# my_square_color = 0 
# colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
motion = [0, 0, 0, 0]

speedMultiplier = 1;

while True:

    # screen.fill((0, 0, 0))

    # pygame.draw.rect(screen, colors[my_square_color], my_square)
    if abs(motion[0]) < 0.1:
        motion[0] = 0
    if abs(motion[1]) < 0.1:
        motion[1] = 0
    if abs(motion[2]) < 0.1:
        motion[2] = 0
    if abs(motion[3]) < 0.1:
        motion[3] = 0

    # leftSpeed = int(motion[1]*speedMultiplier*9+90)
    # rightSpeed = int(motion[3]*speedMultiplier*9+90)
    # WCD.test_left_wheels(leftSpeed)
    # WCD.test_right_wheels(rightSpeed)

    

    # my_square.x += motion[0] * 10 * speedMultiplier/10
    # my_square.y += motion[1] * 10 * speedMultiplier/10
    # my_square.x += motion[2] * 10 * speedMultiplier/10
    # my_square.y += motion[3] * 10 * speedMultiplier/10



    for event in pygame.event.get():
        if event.type == JOYBUTTONDOWN:
            print(str(event) + " " + str(speedMultiplier))
            if event.button == 4:
                if speedMultiplier > 1:
                    speedMultiplier -= 3
            if event.button == 5:
                if speedMultiplier < 10:
                    speedMultiplier += 3
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
            print(speedMultiplier)
            # print(motion)
            # wheelcommand.send2wheels(-1*motion[1], -1*motion[3])
            leftSpeed = int(-motion[1]*speedMultiplier*9+90)
            rightSpeed = int(motion[3]*speedMultiplier*9+90)
            # print(leftSpeed)
            # print(rightSpeed)
            if motion[1] != 0 and motion[3] != 0:
                WCD.test_both_wheels(leftSpeed,rightSpeed)
            elif motion[1] != 0:
                WCD.test_left_wheels(leftSpeed)
            elif motion[3] != 0:
                WCD.test_right_wheels(rightSpeed)

        if event.type == JOYHATMOTION:
            print(event)
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

    pygame.display.update()
    clock.tick(60)
