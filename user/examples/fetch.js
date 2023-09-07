fetch('http://localhost:8080/wheel_command', {
	method: 'POST',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({'left': 0.5, 'right': 0.5})
	})
