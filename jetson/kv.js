
// let map;

// async function initMap() {
//     const position = { lat: -25.344, lng: 131.031 };
//     const { Map } = await google.maps.importLibrary("maps");
//     const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//     map = new Map(document.getElementById("map"), {
//         zoom: 4,
//         center: position,
//         mapId: "DEMO_MAP_ID",
//     });

//     const marker = new AdvancedMarkerElement({
//         map: map,
//         position: position,
//         title: "Uluru",
//     });
// }

// initMap();
// import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();