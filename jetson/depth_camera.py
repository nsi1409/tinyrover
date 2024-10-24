import math
import time
import cv2
import numpy as np
import pyrealsense2 as rs

# Configure depth and color streams
pipeline = rs.pipeline()
config = rs.config()

pipeline_wrapper = rs.pipeline_wrapper(pipeline)
pipeline_profile = config.resolve(pipeline_wrapper)
device = pipeline_profile.get_device()

found_rgb = False
for s in device.sensors:
	if s.get_info(rs.camera_info.name) == 'RGB Camera':
		found_rgb = True
		break
if not found_rgb:
	print("The demo requires Depth camera with Color sensor")
	exit(0)

config.enable_stream(rs.stream.depth, rs.format.z16, 30)
config.enable_stream(rs.stream.color, rs.format.bgr8, 30)

# Start streaming
pipeline.start(config)

# Processing blocks
pc = rs.pointcloud()
decimate = rs.decimation_filter()
# decimate.set_option(rs.option.filter_magnitude, 2 ** state.decimate)
colorizer = rs.colorizer()


while True:
	# Grab camera data
	
	# Wait for a coherent pair of frames: depth and color
	frames = pipeline.wait_for_frames()

	depth_frame = frames.get_depth_frame()
	color_frame = frames.get_color_frame()

	depth_frame = decimate.process(depth_frame)

	# Grab new intrinsics (may be changed by decimation)
	depth_intrinsics = rs.video_stream_profile(
		depth_frame.profile).get_intrinsics()
	w, h = depth_intrinsics.width, depth_intrinsics.height

	depth_image = np.asanyarray(depth_frame.get_data())
	color_image = np.asanyarray(color_frame.get_data())

	
	points = pc.calculate(depth_frame)

	# Pointcloud data to arrays
	v, t = points.get_vertices(), points.get_texture_coordinates()
	verts = np.asanyarray(v).view(np.float32).reshape(-1, 3)  # xyz
	texcoords = np.asanyarray(t).view(np.float32).reshape(-1, 2)  # uv
	print(verts)

# Stop streaming
pipeline.stop()