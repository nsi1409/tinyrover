setInterval(fetchLoop, 400);
//setInterval(fetchFor3dVisualizerLoop, 400);

localEndpoint = "localhost";
remoteEndpoint = "192.168.0.12";

if (document.URL == "http://192.168.0.12:5001/") {
    endpoint = remoteEndpoint;
    $("#location").value = "remote";
} else {
    endpoint = localEndpoint;
    $("#location").value = "local";
}

$("#location").addEventListener('change', function () {
    newLocation = $("#location").value;
    if (newLocation == "remote") {
        endpoint = remoteEndpoint;
    } else {
        endpoint = localEndpoint;
    }
});

$("#send_wheels_left_right").onclick = (event) => {
    leftMag = $("#left").value;
    rightMag = $("#right").value;
    fetch(`http://${endpoint}:8080/wheel_command_both`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'left': leftMag, 'right': rightMag })
    })
};

$("#send_wheels_mag_trim").onclick = (event) => {
    mag = $("#magnitude").value;
    trim = $("#trim").value;
    fetch(`http://${endpoint}:8080/wheel_command_trim`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'magnitude': mag, 'trim': trim })
    })
}

$("#send_wheels_stop").onclick = (event) => {
    send_wheel_stop();
}

document.addEventListener("keydown", (event) => {
    if (event.code == "Enter") {
        send_wheel_stop();
    }
});

function send_wheel_stop() {
    fetch(`http://${endpoint}:8080/wheel_command_stop`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
}


$("#send_smart_turn").onclick = (event) => {
    heading = $("#smart_turn_heading").value;

    fetch(`http://${endpoint}:8080/turn`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'target': heading })
    })
}

$("#send_smart_straight").onclick = (event) => {
    duration = $("#smart_straight_duration").value;
    velocity = $("#smart_straight_velocity").value;

    fetch(`http://${endpoint}:8080/drivestraight`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'duration': duration, 'velocity': velocity })
    })
}

$("#send_smart_direct").onclick = (event) => {
    lat = $("#smart_direct_latitude").value;
    long = $("#smart_direct_longitude").value;

    fetch(`http://${endpoint}:8080/directpath`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'lat': lat, 'long': long })
    })
}

$("#send_path").onclick = (event) => {
    if (currentLineString == null) {
        console.log("cannot send path: none was drawn");
    } else {
        lineStringCoords = currentLineString.getGeometry().getCoordinates();
        convertedCoordinates = [];
        for (i = 0; i < lineStringCoords.length; i++) {
            coord = lineStringCoords[i];
            coordLonLat = ol.proj.toLonLat(coord, ol.proj.Projection(WEB_MERCATOR_PROJ));
            convertedCoordinates[i] = coordLonLat;
        }

        fetch(`http://${endpoint}:8080/path`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'path': convertedCoordinates })
        })
    }
};

function fetchLoop() {
    fetch(`/data`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "k": "gps" })
    }).then((response) => {
        return response.json();
    }).then((data) => {
        $("#gps").innerHTML = "GPS: " + data["v"];
    })

    fetch(`/data`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "k": "quat" })
    }).then((response) => {
        return response.json();
    }).then((data) => {
        $("#quat").innerHTML = "Quaternion: " + data["v"];
    })

    fetch(`/data`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "k": "scuffed_yaw" })
    }).then((response) => {
        return response.json();
    }).then((data) => {
        if (data["v"] == "no value") {
            $("#yaw").innerHTML = "Yaw: no value";
        } else {
            yaw = ((data["v"] / Math.PI) * 180) + 180;
            $("#yaw").innerHTML = "Yaw: " + yaw;
            $('#nyomi').style.transform = "rotate(" + yaw + "deg)";
        }
    })
}

quaternion = new THREE.Quaternion(1, 0, 0, 0);
function fetchFor3dVisualizerLoop() {
    fetch(`/brown`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "k": "quat" })
    }).then((response) => {
        console.log(response);
        return response.json();
    }).then((data) => {
        console.log(data);
        state = data;
        if (data.length == 4) {
            quaternion = new THREE.Quaternion(data[0], data[1], data[2], data[3]);
        }
        $("#gps").innerHTML = "GPS: " + data["gps"];
        $("#quat").innerHTML = "Quaternion: " + data["quat"];
        yaw = data["scuffed_yaw"]
        $("#yaw").innerHTML = "Yaw: " + yaw;
        try {
            gpsData(state);
        }
        catch {

        }
        $('#nyomi').style.transform = "rotate(" + ((yaw * (180 / Math.PI)) + 90) + "deg)"; //west = 0, increases as it turns clockwise, north = 90
    }).catch(error => {
        console.log(error);
    })
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    //console.log(quaternion);
    cube.applyQuaternion(quaternion);
    renderer.render(scene, camera);
}

animate();
