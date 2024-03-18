const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
// fetch(`/data`, {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ "k": "gps" })
// }).then((response) => {
//     console.log(response);
//     return response.json();
// }).then((data) => {
//     console.log(data);
//     $("#gps").innerHTML = "GPS: " + data["v"];
// })

// fetch(`/data`, {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ "k": "quat" })
// }).then((response) => {
//     console.log(response);
//     return response.json();
// }).then((data) => {
//     console.log(data);
//     $("#quat").innerHTML = "Quaternion: " + data["v"];
// })

// fetch(`/data`, {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ "k": "yaw" })
// }).then((response) => {
//     console.log(response);
//     return response.json();
// }).then((data) => {
//     console.log(data);
//     $("#yaw").innerHTML = "Yaw: " + data["v"];
// })


let state = {};

// quaternion = new THREE.Quaternion(1, 0, 0, 0);
function fetchLoop() {
    //fetch(`/data`, {
    fetch($("#location").value + `/everything`).then((response) => {
        // console.log(response.json());
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
        $('#nyomi').style.transform = "rotate(" + (yaw * (180 / Math.PI)) + "deg)"; //west = 0, increases as it turns clockwise, north = 90
    }).catch(error => {
        console.log(error);
    })
}
setInterval(fetchLoop, 400);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth/2, window.innerHeight / 2);
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

