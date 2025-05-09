import * as THREE from 'three';

const Endpoints = { LOCAL: "localhost", REMOTE: "192.168.0.12" };

let endpoint;
let route = "wheel_command_stop";
let body = {};
let sendingRegularCommands = false;

setInterval(sendCurrentWheelControl, 100);
setInterval(fetchLoop, 400);
// setInterval(fetchFor3dVisualizerLoop, 400);

if (document.URL == `http://${Endpoints.REMOTE}:5001/`) {
    endpoint = Endpoints.REMOTE;
    $("#location").value = "remote";
} else {
    endpoint = Endpoints.LOCAL;
    $("#location").value = "local";
}

$("#location").addEventListener('change', function () {
    let newLocation = $("#location").value;
    if (newLocation == "remote") {
        endpoint = Endpoints.REMOTE;
    } else {
        endpoint = Endpoints.LOCAL;
    }
});

function sendCurrentWheelControl() {
    if (sendingRegularCommands) {
        fetch(`http://${endpoint}:8080/${route}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (route == "wheel_command_stop") {
            sendingRegularCommands = false;
        }
    }
}

function sendSmartCommand(route, body) {
    sendingRegularCommands = false;
    fetch(`http://${endpoint}:8081/${route}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

$("#send_wheels_left_right").onclick = (event) => {
    let leftMag = $("#left").value;
    let rightMag = $("#right").value;
    route = "wheel_command_both";
    body = { 'left': leftMag, 'right': rightMag };
    sendingRegularCommands = true;
};

$("#send_wheels_mag_trim").onclick = (event) => {
    let mag = $("#magnitude_slider").value;
    let trim = -$("#trim_slider").value;
    route = "wheel_command_trim";
    body = { 'magnitude': mag, 'trim': trim };
    sendingRegularCommands = true;
}

$("#send_wheels_stop").onclick = (event) => {
    route = "wheel_command_stop";
    body = {};
    sendingRegularCommands = true;
}

document.addEventListener("keydown", (event) => {
    if (event.code == "KeyS" || event.code == "KeyX") {
        route = "wheel_command_stop";
        body = {};
        sendingRegularCommands = true;
    }
});

$("#send_smart_turn").onclick = (event) => {
    let heading = $("#smart_turn_heading").value;
    sendSmartCommand("turn", { 'target': heading });
}

$("#send_smart_straight").onclick = (event) => {
    let duration = $("#smart_straight_duration").value;
    let velocity = $("#smart_straight_velocity").value;
    sendSmartCommand("drivestraight", { 'duration': duration, 'velocity': velocity });
}

$("#send_smart_direct").onclick = (event) => {
    let lat = $("#smart_direct_latitude").value;
    let long = $("#smart_direct_longitude").value;
    sendSmartCommand("directpath", { 'lat': lat, 'long': long });
}


$("#send_path").onclick = (event) => {
    if (currentLineString == null) {
        console.log("cannot send path: none was drawn");
    } else {
        let lineStringCoords = currentLineString.getGeometry().getCoordinates();
        let convertedCoordinates = [];
        for (i = 0; i < lineStringCoords.length; i++) {
            let coord = lineStringCoords[i];
            let coordLonLat = ol.proj.toLonLat(coord, ol.proj.Projection(WEB_MERCATOR_PROJ));
            convertedCoordinates[i] = coordLonLat;
        }
        sendSmartCommand("path", { 'path': convertedCoordinates });
    };
};

$("#magnitude_slider").onchange = (event) => {
    if ($("#magnitude_input").value != $("#magnitude_slider").value) {
        $("#magnitude_input").value = $("#magnitude_slider").value * 100;
    }
}

$("#magnitude_input").onchange = (event) => {
    if ($("#magnitude_input").value != $("#magnitude_slider").value) {
        $("#magnitude_slider").value = $("#magnitude_input").value / 100;
    }
}

$("#trim_slider").onchange = (event) => {
    if ($("#trim_input").value != $("#trim_slider").value) {
        $("#trim_input").value = $("#trim_slider").value * 50;
    }
}

$("#trim_input").onchange = (event) => {
    if ($("#trim_input").value != $("#trim_slider").value) {
        $("#trim_slider").value = $("#trim_input").value / 50;
    }
}

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

let quaternion = new THREE.Quaternion(1, 0, 0, 0);
function fetchFor3dVisualizerLoop() {
    fetch(`/brown`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "k": "quat" })
    }).then((response) => {
        return response.json();
    }).then((data) => {
        let state = data;
        if (data.length == 4) {
            quaternion = new THREE.Quaternion(data[0], data[1], data[2], data[3]);
        }
        $("#gps").innerHTML = "GPS: " + data["gps"];
        $("#quat").innerHTML = "Quaternion: " + data["quat"];
        let yaw = data["scuffed_yaw"]
        $("#yaw").innerHTML = "Yaw: " + yaw;
        try {
            gpsData(state);
        }
        catch {

        }
        $('#nyomi').style.transform = "rotate(" + yaw + "deg)"; //west = 0, increases as it turns clockwise, north = 90
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
    cube.setRotationFromQuaternion(quaternion);
    renderer.render(scene, camera);
}

animate();
