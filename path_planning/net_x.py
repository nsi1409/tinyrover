import networkx as nx
from scipy.spatial import distance


def closest_point(point, G):
	closest = None
	min_dist = float('inf')
	for node in G:
		cur_dist = distance.euclidean(point, node)
		if cur_dist < min_dist or closest is None:
			closest = node
			min_dist = cur_dist
	return closest

def shortest_path(start, end, G):
	return nx.shortest_path(G, start, end, weight='weight')

def rover_path(start, end, G):
	print(start)
	s = closest_point(start, G)
	e = closest_point(end, G)
	main = shortest_path(s, e, G)
	main.insert(0, start)
	main.append(end)
	outp = main
	return outp

def build_graph():
	G = nx.Graph()
	G.add_edges_from([((0, 0), (2, 2), {'weight': 3}), ((2, 2), (3, 3), {'weight': 1}), ((0, 0), (3, 3), {'weight': 5})])
	return G

if __name__ == '__main__':
	G = build_graph()
	print(rover_path((0, -1), (3, 4), G))
