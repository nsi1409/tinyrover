import time
import serial
import pywitmotion as wit

# connected = False
# port = 'COM3'
# baud = 9600

# with serial.Serial(port, baud, timeout=5) as ser:
#     s = ser.read()

#     msgs_num = 0
#     while msgs_num < 100:
        
#         start = time.time()
#         s = ser.read_until(b'U')
#         q = wit.get_quaternion(msgs_num)
#         # q = wit.get_magnetic(msg)
#         # q = wit.get_angle(msg)
#         # q = wit.get_gyro(msg)
#         # q = wit.get_acceleration(msg)
#         if q is not None:
#             msgs_num = msgs_num+1
#             print(q)

# from witmotion import IMU

# def callback(msg):
#     print(msg)

# imu = IMU()
# imu.subscribe(callback)

from serial import *
usb = Serial('COM3', 9600)
usb.timeout = 1
while True:
    print(usb.readline()) # you need to print what you are reading in the script
    msgs_num = 0
    while msgs_num < 100:
        start = time.time()
        s = usb.read_until(b'U')
        q = wit.get_quaternion(msgs_num)
        # q = wit.get_magnetic(msg)
        # q = wit.get_angle(msg)
        # q = wit.get_gyro(msg)
        # q = wit.get_acceleration(msg)
        if q is not None:
            msgs_num = msgs_num+1
            print(q)