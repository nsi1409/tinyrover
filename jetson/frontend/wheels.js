$('#send_wheels').addEventListener("click", () => {
	l = $('#left').value
	r = $('#right').value
	//resp = fetch('http://192.168.0.12:8080/wheel_command', {
	resp = fetch('http://192.168.0.12:8080/wheel_command', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'left': l, 'right': r})
	})
	console.log(resp.json())
})
