import * as THREE from 'three';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

let angle_in_degrees, distance = 0, i;
const PI=3.14;
const sun_size = 70,
    sun_rotation = 0.00005,
    mercury_size = 2,
    mercury_r = 10,
    mercury_angle = 1,
    mercury_rotation = 0.001,
    venus_size = 4,
    venus_r = 13,
    venus_angle = 0.3,
    venus_rotation = 0.001,
    earth_size = 4,
    earth_r = 20,
    earth_angle = 0.1,
    earth_rotation = 0.001,
    mars_size = 3,
    mars_r = 28,
    mars_angle = 0.05,
    mars_rotation = 0.001,
    jupiter_size = 25,
    jupiter_r = 70,
    jupiter_angle = 0.01,
    jupiter_rotation = 0.004,
    saturn_size = 23,
    saturn_r = 70,
    saturn_angle = 0.005,
    saturn_rotation = 0.005,
    uranus_size = 15,
    uranus_r = 140,
    uranus_angle = 0.002,
    uranus_rotation = 0.0025,
    neptune_size = 15,
    neptune_r = 200,
    neptune_angle = 0.001,
    neptune_rotation = 0.0025;

function randomAngle(){
    return Math.floor(Math.random()*361);
}

class Planet{
    constructor(texture, x, y, z, r, angle_step, rotation){
        this.r = r;
        this.angle_step = angle_step;
        this.rotation = rotation;
        if(this.rotation === saturn_rotation){
            this.angle = 0;
            console.log('twoj stary');
        }
        else this.angle = randomAngle();
        const planetTexture = new THREE.TextureLoader().load(texture);
        const planetGeometry = new THREE.SphereGeometry(x, y, z);
        const planetMaterial = new THREE.MeshStandardMaterial({
            map: planetTexture
        });
        this.planet = new THREE.Mesh(planetGeometry, planetMaterial);
        this.planet.position.x += r;
    }

    rotate(){
        this.planet.rotation.y += this.rotation;
    }

    updateOrbit(){
        if(this.angle === 360) this.angle = 0;
        angle_in_degrees = this.angle*PI/180;
        this.planet.position.x = this.r * Math.cos(angle_in_degrees);
        this.planet.position.z = this.r * Math.sin(angle_in_degrees);
        this.angle += this.angle_step;
    }
}

class SaturnRing{
    constructor(texture, x, y, z, r, angle_step, rotation){
        this.r = r;
        this.angle = 0;
        this.angle_step = angle_step;
        this.rotation = rotation;
        const ringTexture = new THREE.TextureLoader().load(texture);
        const ringGeometry = new THREE.RingGeometry(x,y,z);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,});
        this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
        this.ring.position.x += r;
        this.ring.rotation.x += PI/2;
    }

    rotate(){
        this.ring.rotation.z += this.rotation;
    }

    updateOrbit(){
        if(this.angle === 360) this.angle = 0;
        angle_in_degrees = this.angle*PI/180;
        this.ring.position.x = this.r * Math.cos(angle_in_degrees);
        this.ring.position.z = this.r * Math.sin(angle_in_degrees);
        this.angle += this.angle_step;
    }
}

// Adding scena and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'),});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 250;
camera.position.y = 20;
//const controls = new OrbitControls(camera, renderer.domElement);

// adding light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// adding planets and sun
const sun = new Planet('assets/sun.jpg', sun_size, 32, 16, distance, 0, sun_rotation);
scene.add(sun.planet);
distance += sun_size + mercury_r;
const mercury = new Planet('assets/mercury.jpg', mercury_size, 32, 16, distance, mercury_angle, mercury_rotation);
scene.add(mercury.planet);
distance += mercury_size + venus_r;
const venus = new Planet('assets/venus_surface.jpg', venus_size, 32, 16, distance, venus_angle, venus_rotation);
scene.add(venus.planet);
distance += venus_size + earth_r;
const earth = new Planet('assets/earth.jpg', earth_size, 32, 16, distance, earth_angle, earth_rotation);
scene.add(earth.planet);
distance += earth_size + mars_r;
const mars = new Planet('assets/mars.jpg',mars_size, 32, 16, distance, mars_angle, mars_rotation);
scene.add(mars.planet);
distance += mars_size + jupiter_r;
const jupiter = new Planet('assets/jupiter.jpg', jupiter_size, 32, 16, distance, jupiter_angle, jupiter_rotation);
scene.add(jupiter.planet)
distance += jupiter_size + saturn_r;
const saturn = new Planet('assets/saturn.jpg', saturn_size, 32, 16, distance, saturn_angle, saturn_rotation);
scene.add(saturn.planet);
const saturnRing = new SaturnRing('assets/ring.png',25,40,64,distance,saturn_angle, saturn_rotation);
scene.add(saturnRing.ring);
distance += saturn_size + uranus_r;
const uranus = new Planet('assets/uranus.jpg', uranus_size, 32, 16, distance, uranus_angle, uranus_rotation);
scene.add(uranus.planet);
distance += uranus_size + neptune_r;
const neptune = new Planet('assets/neptune.jpg', neptune_size, 32, 16, distance, neptune_angle, neptune_rotation);
scene.add(neptune.planet);

const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

// Adding stars
scene.background = new THREE.TextureLoader().load('assets/stars.jpg');

// change size of canvas on window resize
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener('scroll',onWindowResize, false);

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    sun.rotate();
    for(i=0;i<planets.length;i++){
        planets[i].rotate();
        planets[i].updateOrbit();
    }
    saturnRing.rotate();
    saturnRing.updateOrbit();

    //controls.update();
    renderer.render(scene, camera);
}

animate();
