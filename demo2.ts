/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GUOCHAO82
 * @Date: 2022-04-15 09:47:04
 * @LastEditors: GUOCHAO82
 * @LastEditTime: 2022-04-21 12:41:39
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
point.position.set(0, 2000, 0)
scene.add(point)

// scene.position.set(0, 0, 100)
//环境光
const ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);


// 添加坐标系
const axes = new THREE.AxesHelper(w)
scene.add(axes)


// 创建相机
// const camera = new THREE.OrthographicCamera(-k * S, k * S, S, -S, 1, 1000)
const camera = new THREE.PerspectiveCamera(45, k, 1, 2000)
camera.position.set(20, 800, 400)
camera.lookAt(scene.position)


// 渲染
const renderer = new THREE.WebGLRenderer({
    antialias: true,
})
renderer.setClearColor('#fff', 1); //设置背景颜色
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)



function getGeometry(points, height) {
    let topPoints = [];
    for (let i = 0; i < points.length; i++) {
        let vertice = points[i];
        topPoints.push([vertice[0], vertice[1] + height, vertice[2]]);
    }
    let totalPoints = points.concat(topPoints);
    let vertices = [];           //所有的顶点
    for (let i = 0; i < totalPoints.length; i++) {
        vertices.push(new THREE.Vector3(totalPoints[i][0], totalPoints[i][1], totalPoints[i][2]))
    }
    let length = points.length;
    let faces = [];
    for (let j = 0; j < length; j++) {                      //侧面生成三角形
        if (j != length - 1) {
            faces.push(new Face3(j, j + 1, length + j + 1));
            faces.push(new Face3(length + j + 1, length + j, j));
        } else {
            faces.push(new Face3(j, 0, length));
            faces.push(new Face3(length, length + j, j));
        }
    }
    let data = [];
    for (let i = 0; i < length; i++) {
        data.push(points[i][0], points[i][2]);
    }

    let triangles = Earcut.triangulate(data);
    if (triangles && triangles.length != 0) {
        for (let i = 0; i < triangles.length; i++) {
            let tlength = triangles.length;
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
    let geometry = new Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;
    geometry.computeFaceNormals();      //自动计算法向量

    // 物体
    // console.log(geometry.center()) 

    const material = [
    new THREE.MeshLambertMaterial({ color: '#86909c', side: THREE.DoubleSide }),         //受光照影响
    new THREE.MeshBasicMaterial({ color: '#ffece8', side: THREE.DoubleSide, vertexColors: true,map:new THREE.CanvasTexture(getTopTextCanvas()) })            //不受光照影响
];

    const mesh = new THREE.Mesh(geometry.toBufferGeometry(), material)

    // border 添加边框
    const edges = new THREE.EdgesGeometry(geometry.toBufferGeometry())
    const border = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 'black' }))
    console.log(new THREE.Box3().expandByObject(mesh).max, 'new THREE.Box3().expandByObject(mesh).min')
    groups.add(mesh)
    groups.add(border)


    return {
        positonSet: (x, y, z) => {
            // mesh.position.set(x, y, z)
            // border.position.set(x, y, z)
            mesh.translateX(x)
            mesh.translateY(y)
            mesh.translateZ(z)

            border.translateX(x)
            border.translateY(y)
            border.translateZ(z)
        }
    }
}

// 值作顶部贴图文字
// function getTopTextCanvas(text,x,z) {
//     const w = 400
//     const h = 400
//     const canvas = document.createElement('canvas')
//     canvas.width = w
//     canvas.height = h
//     const ctx = canvas.getContext('2d')
//     ctx.fillStyle = '#C3C3C3'
//     ctx.fillRect(0, 0, w, h)
//     ctx.font="400px Georgia";
//     // ctx.fillStyle = '#2891FF'
//     ctx.fillText('asdfasfdasf', x, z)
//     return canvas
// }


function getTopTextCanvas(){ 
    let texts=[{
        name:"北京",
        value:323
    },{
        name:"杭州",
        value:121
    },{
        name:"南京",
        value:56
    }]
    var width=512, height=256; 
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#C3C3C3';
    ctx.fillRect(0, 0, width, height);
    ctx.font = 32+'px " bold';
    ctx.fillStyle = '#2891FF';
    texts.forEach((text,index)=>{
        ctx.fillText(`${text.name}:${text.value}`, 10, 32 * index + 30);
    }) 
    return canvas;
}



// function getBorderGeometry(points, color) {
//     let geometry = new Geometry();
//     for (let i = 0; i < points.length; i++) {
//         let point = points[i];
//         geometry.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
//         if (i == point.length - 1) {
//             geometry.vertices.push(new THREE.Vector3(point[0][0], point[0][1], point[0][2]));
//         }
//     }
//     return geometry;
// }



// function onDocumentMouseClick(event){
//     let vector = new THREE.Vector3();//三维坐标对象
//     vector.set(
//             ( event.clientX / container.clientWidth ) * 2 - 1,
//             - ( event.clientY / container.clientHeight ) * 2 + 1,
//             0.5 );
//     vector.unproject( camera );
//     let raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
//        let intersects = raycaster.intersectObjects(floorGroup.children);        //楼层中的元素
//        if (intersects.length > 0) {
//         let item = intersects[0].object;
//         item.material =  new THREE.MeshBasicMaterial({color: "#f86332",side:THREE.DoubleSide});        //选中的样式
//     }
// }
const groups = new THREE.Group()

// const points = [[0, 0, 0], [0, 0, -100], [50, 0, -100], [50, 0, -80], [70, 0, -80],  [70, 0, -40],  [50, 0, 0]]
const points = {
    603: [[0, 0, 0], [200, 0, 0], [200, 0, 80], [0, 0, 80]],
    601: [[0, 0, 0], [60, 0, 0], [60, 0, 80], [0, 0, 80]],
    606: [[0, 0, 0], [60, 0, 0], [60, 0, 200], [0, 0, 200]],
    605: [[30, 0, 30], [30, 0, 0], [200, 0, 0], [200, 0, 200], [0, 0, 200], [0, 0, 30]],

}
getGeometry(points[603], 10)
getGeometry(points[603], 10).positonSet(204, 0, 0)
getGeometry(points[601], 10).positonSet(200 * 2 + 8, 0, 0)
getGeometry(points[606], 10).positonSet(0, 0, -240)
getGeometry(points[605], 10).positonSet(268, 0, -240)

// getGeometry(points, 10).positonSet(80,0,0)
// const borders = getBorderGeometry(topPoints, 'red')





// const mesh = 
// groups.traverse(child=>{
// // groups.translateX(-200)
// console.log(child.isMesh,'----')
//     let center = new THREE.Box3().setFromObject(child).getCenter()
//     console.log(center,'---center')
// })

// groups.translateX(-200)
// groups.translateZ(80)
groups.position.set(-200, 0, 80)
// console.log(scene.cen,'----position')

scene.add(groups)
function render() {
    renderer.render(scene, camera);//执行渲染操作
    groups.rotateY(0.01);//每次绕y轴旋转0.01弧度
    // requestAnimationFrame(render)
}

const controls = new OrbitControls(camera, renderer.domElement)

controls.addEventListener('change', render)

renderer.render(scene, camera)