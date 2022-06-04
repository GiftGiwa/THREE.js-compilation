import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';

//starter
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//orbit controls
let controls = new OrbitControls(camera, renderer.domElement)

//HDRI MAP
const hdrEquirect = new RGBELoader().load(
	"./paul_lobe_haus_4k.hdr",  
	() => { hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; }
);

//materials
const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0xdce0e6, 
	metalness:0, opacity:1.0, transmission:1, envMap: hdrEquirect, 
	roughness:0, depthTest: true} )
const equatorMaterial = new THREE.MeshStandardMaterial({color: 0x242526, metalness:1, 
	opacity:0.8, roughness:0.8} )


let mesh;
let geometry;
const loader = new GLTFLoader()


//loading gltf model
loader.load( './ball.gltf', function ( gltf ) { //load sphere
	
	gltf.scene.traverse(function(model) {
		if (model.isMesh) {
			//model.castShadow = true;
			geometry = model.geometry
		}
	});

	gltf.scene.children[0].material = sphereMaterial
	//mesh = gltf.scene

	mesh = new THREE.InstancedMesh(gltf.scene.children[0].geometry, equatorMaterial, 5)

	console.log(mesh)
	//mesh.children.push(new THREE.Mesh(gltf.scene.children[0].geometry, equatorMaterial))

	console.log(mesh.children)
	mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage )

	scene.add( mesh )	
}, undefined, function ( error ) {
	console.error( error );
} );


//light
const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

//render
function animate() {
	requestAnimationFrame( animate );	
	
	renderer.render( scene, camera );
}
animate()