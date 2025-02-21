import requests

def get_elevation(lat, long):
	url = 'https://epqs.nationalmap.gov/v1/json'
	params = {
		'x': long,
		'y': lat,
		'units': 'Feet',
		'wkid': 4326,
		'includeDate': False
	}
	r = requests.get(url, params=params)
	json = r.json()
	if not r.ok:
		raise Exception("failed to fetch")
	return json['value']

if __name__ == '__main__':
	for i in range(10):
		for j in range(10):
			lat = 40.015+(0.01*i)
			long = -105.2705+(0.01*j)
			print(lat)
			print(long)
			print(get_elevation(lat, long))
