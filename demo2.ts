/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GUOCHAO82
 * @Date: 2022-04-15 09:47:04
 * @LastEditors: GUOCHAO82
 * @LastEditTime: 2022-04-15 18:25:39
 */
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Face3, Geometry } from "three/examples/jsm/deprecated/Geometry";
import { Earcut } from 'three/src/extras/Earcut'

const w = window.innerWidth // 容器宽高
const h = window.innerHeight
const k = w / h // 宽高比
const S = 200

// 创建环境
const scene = new THREE.Scene()



// 点光源
const point = new THREE.PointLight()
point.position.set(100,200,300)
scene.add(point)

scene.position.set(0,0,100)
//环境光
const ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);


// 添加坐标系
const axes = new THREE.AxesHelper(w)
scene.add(axes)


// 创建相机
// const camera = new THREE.OrthographicCamera(-k * S, k * S, S, -S, 1, 1000)
const camera = new THREE.PerspectiveCamera(45, k, 1, 1000)
camera.position.set(250, 150, 100)
camera.lookAt(scene.position)


// 渲染
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor('#fff', 1); //设置背景颜色
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)



function getGeometry(points, height) {
    var topPoints = [];
    for (var i = 0; i < points.length; i++) {
        var vertice = points[i];
        topPoints.push([vertice[0], vertice[1] + height, vertice[2]]);
    }
    var totalPoints = points.concat(topPoints);
    var vertices = [];           //所有的顶点
    for (var i = 0; i < totalPoints.length; i++) {
        vertices.push(new THREE.Vector3(totalPoints[i][0], totalPoints[i][1], totalPoints[i][2]))
    }
    var length = points.length;
    var faces = [];
    for (var j = 0; j < length; j++) {                      //侧面生成三角形
        if (j != length - 1) {
            faces.push(new Face3(j, j + 1, length + j + 1));
            faces.push(new Face3(length + j + 1, length + j, j));
        } else {
            faces.push(new Face3(j, 0, length));
            faces.push(new Face3(length, length + j, j));
        }
    }
    var data = [];
    for (var i = 0; i < length; i++) {
        data.push(points[i][0], points[i][2]);
    }

    var triangles = Earcut.triangulate(data);
    if (triangles && triangles.length != 0) {
        for (var i = 0; i < triangles.length; i++) {
            var tlength = triangles.length;
            if (i % 3 == 0 && i < tlength - 2) {
                faces.push(new Face3(triangles[i], triangles[i + 1], triangles[i + 2]));                            //底部的三角面
                faces.push(new Face3(
                    triangles[i] + length,
                    triangles[i + 1] + length,
                    triangles[i + 2] + length,
                    null,
                    new THREE.Color('#fff'),
                    1
                )); //顶部的三角面
            }
        }
    }
    var geometry = new Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;
    geometry.computeFaceNormals();      //自动计算法向量
    return {
        geometry,
        topPoints,
    };
}

function getBorderGeometry(points, color) {
    var geometry = new Geometry();
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        geometry.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
        if (i == point.length - 1) {
            geometry.vertices.push(new THREE.Vector3(point[0][0], point[0][1], point[0][2]));
        }
    }
    return geometry;
}



// function onDocumentMouseClick(event){
//     var vector = new THREE.Vector3();//三维坐标对象
//     vector.set(
//             ( event.clientX / container.clientWidth ) * 2 - 1,
//             - ( event.clientY / container.clientHeight ) * 2 + 1,
//             0.5 );
//     vector.unproject( camera );
//     var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
//        var intersects = raycaster.intersectObjects(floorGroup.children);        //楼层中的元素
//        if (intersects.length > 0) {
//         var item = intersects[0].object;
//         item.material =  new THREE.MeshBasicMaterial({color: "#f86332",side:THREE.DoubleSide});        //选中的样式
//     }
// }
const groups = new THREE.Group()

const points = [[0, 0, 0], [0, 0, -100], [50, 0, -100], [50, 0, 0]]
const {geometry,topPoints} = getGeometry(points, 10)
const borders = getBorderGeometry(topPoints, 'red')



const material = [
    new THREE.MeshLambertMaterial({ color: '#86909c', side: THREE.DoubleSide }),         //受光照影响
    new THREE.MeshBasicMaterial({ color: '#ffece8', side: THREE.DoubleSide, vertexColors: true })            //不受光照影响
];

// const mesh = 

groups.add(new THREE.Mesh(geometry.toBufferGeometry(), material))

var edges = new THREE.EdgesGeometry( borders.toBufferGeometry());
groups.add(new THREE.LineSegments(edges,material[1]))
// console.log(geometry,'---geometry')

scene.add(groups)
function render() {
    renderer.render(scene, camera);//执行渲染操作
    groups.rotateY(0.01);//每次绕y轴旋转0.01弧度
    // requestAnimationFrame(render)
}

const controls = new OrbitControls(camera, renderer.domElement)

controls.addEventListener('change', render)

renderer.render(scene, camera)