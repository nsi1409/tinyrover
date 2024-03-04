import cv2
import cv2.aruco as aruco
from simple_pid import PID
import requests
import numpy as np
import math

cap = cv2.VideoCapture(0)
aruco_dict = aruco.Dictionary_get(aruco.DICT_6X6_1000)
arucoParameters = aruco.DetectorParameters_create()
pid = PID(1, 0.1, 0.05, setpoint=0, output_limits=(-1, 1)) #Setpoint right in center
#pid = PID(1, 0.1, 0.05, setpoint=0) #Setpoint right in center

#center = 65 #On Larsen's camera
center = 200 #On Evan's camera
#center = 65 #On Rover's camera
# If value is greater than center, the tag is on the right, else it is on the left
count = 0

def send2wheels_both(l, r):
	return
	req = requests.get('http://192.168.0.12:8080/wheel_command_both', json={
		"left": l, "right": r
	})

camera_matrix = np.array([[841.94627,	0.0,		261.54048],
							[0.0,		873.18284,	339.55072],
							[0.0,		0.0,		1.0]])
distortion_matrix = np.array([[-1.161702, 1.332406, -0.043440, 0.095651, 0.0]])
marker_size = 100

def get_euclid(corners):
	rvec, tvec, _ = aruco.estimatePoseSingleMarkers(corners, marker_size, camera_matrix, distortion_matrix)
	total = 0
	for degree in tvec[0][0]:
		total += degree ** 2
	total = math.sqrt(total)
	return total

send2wheels_both(0, 0)

while(True):
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    #print(np.shape(gray))
    corners, ids, _ = aruco.detectMarkers(gray, aruco_dict, parameters=arucoParameters)
    if(corners):
        dist = get_euclid(corners)
        if dist < 600:
            count += 1
            if count > 120:
                send2wheels_both(90, 90)
                exit()
        else:
            count -= 1
            if count < 0:
                count = 0
        total = 0
        for corner in corners[0][0]:
            total = corner[0]
        avgx = total/4
        #print(avgx)

        normal_avg_x = (avgx - center)/center
        control = pid(normal_avg_x)
        #print(control)
        if(control > 0):
            right = 1
            left = 1 - control
            direction = "left"
        else:
            left = 1
            right = 1 - ((-1) * control)
            direction = "right"

        left = int((left * 60) + 90)
        right = int((right * 60) + 90)
        send2wheels_both(left, right)
        print(f"normal x: {normal_avg_x}, direction: {direction}, left: {left}, right: {right}, dist: {dist}")
