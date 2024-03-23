
# Method

The approach is to map topography data of the site using a polygon mesh. Next, we manually set weights on each edge based on a variety of factors. Lastly, we use Dijkstra's Algorithm to efficiently traverse the mesh.

# Factors

Current factors affecting the edges include:

- Distance
- Terrain

Weights will be manually set based on these factors. The overarching goal is to create a weighted graph for Dijkstra's Algorithm

# Sources

PointCloud & STL files: <https://maps.equatorstudios.com/>
