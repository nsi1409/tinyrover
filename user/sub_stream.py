import pickle
import socket
import struct
import cv2

while True:
    try:
        s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        s.connect(('127.0.0.1', 8089))
        data = b''
        payload_size = struct.calcsize("L")
        break
    except:
        print('failed to connect')

while True:
    while len(data) < payload_size:
        data += s.recv(4096)
    packed_msg_size = data[:payload_size]
    data = data[payload_size:]
    msg_size = struct.unpack("L", packed_msg_size)[0]
    while len(data) < msg_size:
        data += s.recv(4096)
    frame_data = data[:msg_size]
    data = data[msg_size:]
    frame = pickle.loads(frame_data)
    cv2.imshow('frame', frame)
    cv2.waitKey(1)
