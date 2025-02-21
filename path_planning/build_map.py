from elevation import get_elevation
import csv


def build(center_lat, center_long):
	with open('grid.csv', 'w', newline='') as csvfile:
		writer = csv.writer(csvfile, delimiter=' ', quotechar='|', quoting=csv.QUOTE_MINIMAL)
		writer.writerow(['Lat', 'Long', 'Elevation'])

		for i in range(4):
			for j in range(4):
				lat = center_lat+(0.01*i)
				long = center_long+(0.01*j)
				elevation = get_elevation(lat, long)
				print(elevation)
				writer.writerow([lat, long, elevation])


if __name__ == '__main__':
	build(38.4065, -110.7919)
