import numpy as np
import laspy as lp
from stl import mesh
import matplotlib.tri as mtri

def grid_subsampling(points, voxel_size):

  nb_vox=np.ceil((np.max(points, axis=0) - np.min(points, axis=0))/voxel_size)
  non_empty_voxel_keys, inverse, nb_pts_per_voxel= np.unique(((points - np.min(points, axis=0)) // voxel_size).astype(int), axis=0, return_inverse=True, return_counts=True)
  idx_pts_vox_sorted=np.argsort(inverse)
  voxel_grid={}
  grid_barycenter,grid_candidate_center=[],[]
  last_seen=0

  for idx,vox in enumerate(non_empty_voxel_keys):
    voxel_grid[tuple(vox)]=points[idx_pts_vox_sorted[last_seen:last_seen+nb_pts_per_voxel[idx]]]
    grid_barycenter.append(np.mean(voxel_grid[tuple(vox)],axis=0))
    grid_candidate_center.append(voxel_grid[tuple(vox)][np.linalg.norm(voxel_grid[tuple(vox)]-np.mean(voxel_grid[tuple(vox)],axis=0),axis=1).argmin()])
    last_seen+=nb_pts_per_voxel[idx]

  return grid_candidate_center

lidar_file = "path_planning\mars_lidar.laz"
point_cloud = lp.read(lidar_file)

# store coordinates
points = np.vstack((point_cloud.x, point_cloud.y, point_cloud.z)).transpose()

# grid sampling
voxel_size=15 # meters
nb_vox=np.ceil((np.max(points, axis=0) - np.min(points, axis=0))/voxel_size)

grid_sampled_point_cloud = grid_subsampling(points, voxel_size)
grid_sample_pc_np = np.array(grid_sampled_point_cloud)

x_all = grid_sample_pc_np[:,0]
y_all = grid_sample_pc_np[:,1]
z_all = grid_sample_pc_np[:,2]

tris = mtri.Triangulation(x_all, y_all)

data = np.zeros(len(tris.triangles), dtype=mesh.Mesh.dtype)
m = mesh.Mesh(data, remove_empty_areas=False)
m.x[:] = x_all[tris.triangles]
m.y[:] = y_all[tris.triangles]
m.z[:] = z_all[tris.triangles]

m.save('mars_lidar_mesh.stl')