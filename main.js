import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from 'lil-gui'


// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const Parameter = {}

Parameter.Count = 10000
Parameter.Size = 0.01
Parameter.Radius = 5
Parameter.Branch = 3
Parameter.Spin = 1
Parameter.Random = 0.2
Parameter.Power = 3
Parameter.innercolor =  '#ff6030'
Parameter.Outercolor =  '#00ff88'

let geometry = null
let material = null
let points = null

const GalaxyGenerator = () => {
    if(points !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry();
    const position = new Float32Array(Parameter.Count * 3)
    const color = new Float32Array(Parameter.Count * 3)
    const colorinside = new THREE.Color(Parameter.innercolor)
    const coloroutside = new THREE.Color(Parameter.Outercolor)

    for (let i = 0; i < Parameter.Count; i++) {
        const i3 = i * 3
        const branchAngle = (i % Parameter.Branch ) / Parameter.Branch * Math.PI *2
        const radius = Math.random() * Parameter.Radius
        const spinAngle = radius *  Parameter.Spin
        const  randomx = Math.pow(Math.random(),Parameter.Power) * (Math.random() < 0.5 ? 1:-1)
        const  randomy = Math.pow(Math.random(),Parameter.Power) * (Math.random() < 0.5 ? 1:-1)
        const  randomz = Math.pow(Math.random(),Parameter.Power) * (Math.random() < 0.5 ? 1:-1)

        position[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomx 
        position[i3 + 1] = randomy
        position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomz

        const mixedcolor = colorinside.clone()
        mixedcolor.lerp(coloroutside ,radius/Parameter.Radius)
        color[i3 + 0] = mixedcolor.r
        color[i3 + 1] = mixedcolor.g
        color[i3 + 2] = mixedcolor.b

    }
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
    material = new THREE.PointsMaterial({ size: Parameter.Size, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending ,vertexColors:true})
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

GalaxyGenerator()


//gui
gui.add(Parameter, 'Count').min(100).max(100000).step(100).onFinishChange(GalaxyGenerator)
gui.add(Parameter, 'Size').min(0.001).max(0.1).step(0.001).onFinishChange(GalaxyGenerator)
gui.add(Parameter, 'Radius').min(1).max(20).step(1).onFinishChange(GalaxyGenerator)
gui.add(Parameter, 'Branch').min(2).max(20).step(1).onFinishChange(GalaxyGenerator)
gui.add(Parameter, 'Spin').min(-5).max(5).step(0.001).onFinishChange(GalaxyGenerator)
gui.add(Parameter, 'Random').min(0).max(1).step(0.001).onFinishChange(GalaxyGenerator)
gui.add(Parameter, 'Power').min(1).max(10).step(0.001).onFinishChange(GalaxyGenerator)
gui.addColor(Parameter, 'innercolor').onFinishChange(GalaxyGenerator)
gui.addColor(Parameter, 'Outercolor').onFinishChange(GalaxyGenerator)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
gui.add(controls,'autoRotate')

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()