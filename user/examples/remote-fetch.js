async function main() {
	resp = await fetch('http://192.168.0.12:8080/wheel_command', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({'left': 127, 'right': 127})
	})
	console.log(resp.json())
}
main()
