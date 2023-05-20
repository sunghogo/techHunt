import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const textureFilePath = "/static/img/earth-texture-2k.jpg";

// Create a scene, a camera, and a renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// Create a sphere to represent the Earth
let geometry = new THREE.SphereGeometry(1, 32, 32);
let texture = new THREE.TextureLoader().load(textureFilePath);
let material = new THREE.MeshBasicMaterial({ map: texture });
let earth = new THREE.Mesh(geometry, material);
scene.add(earth);

camera.position.z = 2;

// Create orbit controls
let controls = new OrbitControls(camera, renderer.domElement);
let autoRotate = true;

// Event Listeners
controls.addEventListener("start", function () {
  autoRotate = false; // Stop rotation when user starts interacting
});

controls.addEventListener("end", function () {
  autoRotate = true; // Starts rotation when user stop interacting
});

let jobs = [
  { title: "Software Developer", location: { lat: 37.7749, lon: -122.4194 } }, // San Francisco
  { title: "Web Developer", location: { lat: 40.7128, lon: -74.006 } }, // New York
];

let projection = d3
  .geoOrthographic()
  .scale(200)
  .translate([width / 2, height / 2])
  .clipAngle(90);

jobs.forEach((job) => {
  let [x, y, z] = projection([job.location.lon, job.location.lat]);
  let jobGeometry = new THREE.SphereGeometry(0.02, 32, 32);
  let jobMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  let jobMesh = new THREE.Mesh(jobGeometry, jobMaterial);
  jobMesh.position.set(x, y, z);
  earth.add(jobMesh);
});

// Animate the scene
let animate = function () {
  requestAnimationFrame(animate);
  if (autoRotate) earth.rotation.y += 0.002;
  controls.update();
  renderer.render(scene, camera);
};

animate();
