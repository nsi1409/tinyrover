from flask import Flask, request

app = Flask(__name__)
state = {}

@app.route('/data', methods=['GET', 'PUT'])
def data():
	data = request.get_json()
	if request.method == 'PUT':
		k = data['k']
		v = data['v']
		state[k] = v
		return 'ok', 200
	else:
		k = data['k']
		v = state[k]
		return {'v': v}, 200

if __name__ == '__main__':
	app.run()
