from flask import Flask, request

app = Flask(__name__)

state = {'q': None}

@app.route('/data', methods=['GET', 'PUT'])
def data():
	if request.method == 'PUT':
		state['q'] = 'set'
		return 'ok', 200
	else:
		return state, 200

if __name__ == '__main__':
	app.run()
