import cv2
import numpy as np
import socket
import sys
import pickle
import struct

HOST = ''
PORT = 8089
cap=cv2.VideoCapture(2)

while True:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind((HOST, PORT))
        s.listen(10)
        conn, addr = s.accept()
        break
    except KeyboardInterrupt:
        exit()
    except:
        print('failed to connect')

while True:
	ret,frame=cap.read()
	data = pickle.dumps(frame)
	message_size = struct.pack("L", len(data))
	conn.sendall(message_size + data)
