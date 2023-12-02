import pyrealsense2 as rs
import numpy as np
import cv2

def main():
    pipeline = rs.pipeline()
    pipeline.start()
    try:
        while True:
            frames = pipeline.wait_for_frames()
            f1 = frames.get_fisheye_frame(1)
            f2 = frames.get_fisheye_frame(2)
            if not f1:
                continue
            assert f1 and f2
            image1 = np.asanyarray(f1.get_data())
            image2 = np.asanyarray(f2.get_data())
            images = np.hstack((image1, image2))
            cv2.namedWindow('RealSense', cv2.WINDOW_AUTOSIZE)
            cv2.imshow('RealSense', images)
            key = cv2.waitKey(1)
            if key == 27: # ESC
                return
            if key == ord('s'):
                cv2.imwrite("a.jpg", images)
    finally:
        pipeline.stop()

if __name__ == "__main__":
    main()

