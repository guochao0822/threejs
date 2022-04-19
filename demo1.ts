/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GUOCHAO82
 * @Date: 2022-04-14 10:40:17
 * @LastEditors: GUOCHAO82
 * @LastEditTime: 2022-04-15 10:55:48
 */
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three'

console.log(THREE.Face3, '-----------Face3')
const w = window.innerWidth // 容器宽高
const h = window.innerHeight 
const k = w/h // 宽高比
const S = 200
// 场景
const scene = new THREE.Scene()



const x=0,y=0;
const radius = 100

const c = 0.552284749831*radius

const shape = new THREE.Shape()
// .moveTo(x, y+radius/3)
// .bezierCurveTo(x-c,y+radius, x-radius,y+c, x-radius,y)
// .bezierCurveTo(x-radius,y-c, x-c,y-radius/3, x, y-radius)
// .bezierCurveTo(x+c,y-radius/3, x+radius,y-c, x+radius, y)
// .bezierCurveTo(x+radius,y+c, x+c,y+radius, x,y+radius/3)

.moveTo( 25, 25 )
.bezierCurveTo( 25, 25, 20, 0, 0, 0 )
.bezierCurveTo( 30, 0, 30, 35,30,35 )
.bezierCurveTo( 30, 55, 10, 77, 25, 95 )
.bezierCurveTo( 60, 77, 80, 55, 80, 35 )
.bezierCurveTo( 80, 35, 80, 0, 50, 0 )
.bezierCurveTo( 35, 0, 25, 25, 25, 25 )
.bezierCurveTo( -10, 10,  -25, 80, 25, 95 )

const geometry = new THREE.ExtrudeGeometry(shape,{
    amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1
})

const material = new THREE.MeshPhongMaterial({
    color: 0xFF0000,
    shininess:150,
})

// 合成物体
const mesh = new THREE.Mesh(geometry,material)

// 添加到场景中
scene.add(mesh)

// 添加坐标系
const axes = new THREE.AxesHelper(w)
scene.add(axes)

// 点光源
const point = new THREE.PointLight()
point.position.set(100,200,300)
scene.add(point)

//环境光
const ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);


// 设置相机
const camera = new THREE.OrthographicCamera(-k*S, k*S, S, -S, 1, 1000)
camera.position.set(50,100,300)
camera.lookAt(scene.position)

/**
 * 创建渲染对象
 */

const renderer = new THREE.WebGLRenderer()
// renderer.setClearColor('#fff', 1); //设置背景颜色
renderer.setSize(w,h)
document.body.appendChild(renderer.domElement)
renderer.render(scene,camera)


function render() {
    renderer.render(scene,camera);//执行渲染操作
    mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
    // requestAnimationFrame(render)
}

// render()

const controls = new OrbitControls(camera, renderer.domElement)

controls.addEventListener('change',render)

console.log(controls)