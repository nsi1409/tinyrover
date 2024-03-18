import laspy

with laspy.open('path_planning/mars_lidar.laz') as f:
    print(f"Point format:       {f.header.point_format}")
    print(f"Number of points:   {f.header.point_count}")