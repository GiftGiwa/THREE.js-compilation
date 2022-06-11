import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
//import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';

//starter
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = -60;
camera.position.y = 6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio * 4);
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//orbit controls
//let controls = new OrbitControls(camera, renderer.domElement)

//HDRI MAP
const hdrEquirect = new RGBELoader().load(
	"./paul_lobe_haus_4k.hdr",  
	() => { hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; }
);

//materials
const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0xdce0e6, 
	metalness:0, opacity:1.0, transmission:1, envMap: hdrEquirect, 
	roughness:0, depthTest: true} )
/*const equatorMaterial = new THREE.MeshStandardMaterial({color: 0x242526, metalness:1, 
	opacity:0.8, roughness:0.8} )*/

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
                                                                                                                  
let all = [...Array(12)].map((e) => new THREE.Mesh()) //array of spheres/equators; for now, everthing is blank Meshes
console.log(all)

let positions = [] 

manager.onLoad = (e) => {
	console.log("loading complete!")
	console.log(positions)
}

//loading models
for (let i = 0; i < 12; i++) {
	
	let scale = Math.floor(Math.random() * 3) + 1
	let pos_x = Math.floor(Math.random() * 9) * 4 - 15
	let pos_y = Math.floor(Math.random() * 9) * 4 - 15
	let pos_z = Math.floor(Math.random() * 9) * 4 - 15

	loader.load( './ball.gltf', function ( gltf ) { //load sphere
		gltf.scene.traverse(function(model) {
			if (model.isMesh) {
				model.castShadow = true;
			}
		});

		gltf.scene.children[0].material = sphereMaterial

		all[i] = gltf.scene
		all[i].position.set(pos_x, pos_y, pos_z)
		all[i].scale.set(scale, scale, scale)

		positions.push(all[i].position.distanceTo(new THREE.Vector3(0, all[i].position.y, 0))) //log distances between meshes and y-axis

		scene.add( all[i] )	
		
	}, undefined, function ( error ) {
		console.error( error );
	} );
}

//light
const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

let x = 0
let z = 0
let theta = 0

let frequencies = []

for (let k = 0; k < all.length; k++) {
	frequencies.push((Math.random() * 5))
}

//render
function animate() {

	requestAnimationFrame( animate );
	camera.lookAt(0, 0, 60)

	x += 0.01
	z += 0.01
	theta += 0.01
		
	for (let j = 0; j < all.length; j++) {
		
		all[j].position.x = positions[j] * Math.cos(frequencies[j] * theta)
		all[j].position.z = positions[j] * Math.sin(frequencies[j] * theta)

		all[j].rotation.y += 0.05
	}
	renderer.render( scene, camera );
}
animate()