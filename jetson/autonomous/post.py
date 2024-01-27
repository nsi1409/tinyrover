import cv2
import cv2.aruco as aruco
from simple_pid import PID
import sys
import requests

def send2wheels_both(l, r):
	req = requests.get('http://192.168.0.12:8080/wheel_command_both', json={
		"left": l, "right": r
	})

sys.path.append('..')

pid = PID(1, 0.1, 0.05, setpoint=0) #Setpoint right in center

cap = cv2.VideoCapture(0)

aruco_dict = aruco.Dictionary_get(aruco.DICT_6X6_1000)
arucoParameters = aruco.DetectorParameters_create()

# kv.send 00 set both wheels to stop at beginning
send2wheels_both(0,0)

center = 65 #On Larsen's camera
# If value is greater than center, the tag is on the right, else it is on the left

value = 0

while(True):
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    corners, ids, _ = aruco.detectMarkers(
            gray, aruco_dict, parameters=arucoParameters
        )
    # print(corners, type(corners))
    if(corners):
        total = 0
        for corner in corners[0][0]:
            total = corner[0]
        avgx = total/4
        # print(avgx)

        normal_avg_x = (avgx - center)/center
        normal_avg_x = 0.75
        control = pid(normal_avg_x)
        # send value off to something

        if(control > 0):
            right = control
            left = 1
            direction = "left"
            greatest = max(left, right)
            right = right/greatest
            left = left/greatest
        else:
            left = (-1) * control
            right = 1
            direction = "right"
            greatest = max(left, right)
            right = right/greatest
            left = left/greatest

        send2wheels_both(left, right)
        print(f"normal x {normal_avg_x}, direction {direction}, left {left}, right {right}")
    




