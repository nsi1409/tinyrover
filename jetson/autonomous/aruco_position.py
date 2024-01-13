#!/usr/bin/env python3
import cv2
import numpy as np
import cv2.aruco as aruco

cap = cv2.VideoCapture(0)

while(True):
	ret, frame = cap.read()
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	aruco_dict = aruco.Dictionary_get(aruco.DICT_6X6_50)
	arucoParameters = aruco.DetectorParameters_create()
	corners, ids, rejectedImgPoints = aruco.detectMarkers(
		gray, aruco_dict, parameters=arucoParameters)
	frame = aruco.drawDetectedMarkers(frame, corners)
	cv2.imshow('Display', frame)

	camera_matrix = np.array([[841.94627, 	0.0,		261.54048],
								[0.0,		873.18284,	339.55072],
								[0.0,		0.0,		1.0]])

	distortion_matrix = np.array([[-1.161702, 1.332406, -0.043440, 0.095651, 0.0]])

	marker_size = 100
	rvec, tvec, _ = aruco.estimatePoseSingleMarkers(corners, marker_size, camera_matrix, distortion_matrix)

	print(tvec)

	if cv2.waitKey(1) & 0xFF == ord('q'):
		break

cap.release()
cv2.destroyAllWindows()
