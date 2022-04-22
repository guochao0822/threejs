/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GUOCHAO82
 * @Date: 2022-04-15 15:12:31
 * @LastEditors: GUOCHAO82
 * @LastEditTime: 2022-04-21 19:53:11
 */

import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Face3, Geometry } from "three/examples/jsm/deprecated/Geometry";
import { Earcut } from 'three/src/extras/Earcut'

const w = window.innerWidth // 容器宽高
const h = window.innerHeight
const k = w / h // 宽高比
const S = 200

interface ModelOpts {
    w: number,
    h: number,
}

class Model {
    w = 0
    h = 0
    k = 0
    s = 200
    scene = new THREE.Scene()
    groups = new THREE.Group()
    camera: THREE.PerspectiveCamera = null
    renderer: THREE.WebGLRenderer
    controls: OrbitControls

    constructor(options?: ModelOpts) {
        const {
            w = window.innerWidth,
            h = window.innerHeight
        } = options || {}
        this.w = w
        this.h = h
        this.k = w / h
        const axes = new THREE.AxesHelper(w)
        this.scene.add(axes)
        this.scene.add(this.groups)
    }

    render(model: Model) {
        model.renderer.render(this.scene, this.camera)
        model.groups.rotateY(0.01);//每次绕y轴旋转0.01弧度
        return model
    }
    initCamera() {
        console.log(this.k, '-kkkkkkkkkkk')
        this.camera = new THREE.PerspectiveCamera(45, this.k, 0.1, 5000)
        this.camera.position.set(20, -80, 200);
        this.camera.lookAt(0, 0, 0.01);

        return this
    }


    initLight() {
        const point = new THREE.PointLight()
        point.position.set(60, 100, 200);
        this.scene.add(point)

        const ambient = new THREE.AmbientLight(0x444444);
        this.scene.add(ambient);

        return this
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        })

        this.renderer.setPixelRatio(window.devicePixelRatio);
        // 清除背景色，透明背景
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setSize(this.w, this.h);
        document.body.appendChild(this.renderer.domElement)
        return this
    }

    getGeometry(points: [number, number][]) {
        // const shape = new THREE.Shape()
        // points.forEach((point, index) => {
        //     if (!index) {
        //         shape.moveTo(...point)
        //     } else {
        //         shape.lineTo(...point)
        //     }
        // })

        // const geometry = new THREE.ExtrudeGeometry(shape, {
        //     // steps: 2,
        //     // depth: 16,
        //     // bevelEnabled: true,
        //     // bevelThickness: 1,
        //     // bevelSize: 1,
        //     // bevelSegments: 1
        //     // amount: 8,
        //     depth: 40,
        //     bevelEnabled: true,
        //     // bevelSegments: 1,
        //     bevelThickness: 0.2
        //     // UVGenerator:
        // })


        // const materials = [
        //     new THREE.MeshBasicMaterial({
        //         // metalness: 1,
        //         // map: new THREE.CanvasTexture(this.getTopTextCanvas()),
        //         // map: new THREE.TextureLoader().load("./xxx.jpg")
        //         // map:new THREE.TextureLoader().load("./nx.jpg")
        //         color: '#ffece8'
        //     }),
        //     new THREE.MeshBasicMaterial({
        //         // metalness: 1,
        //         // roughness: 1,
        //         color: 'green',
        //     })
        // ]

        // const mesh = new THREE.Mesh(geometry,materials)
        // // this.groups.add(mesh)
        // mesh.castShadow = true
        // mesh.receiveShadow = true
        // this.getSprite()
        // return this
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#0000ff";
        ctx.font = "20px Arial";
        ctx.lineWidth = 1;
        ctx.fillText("ABCDRE", 4, 20);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        //使用Sprite显示文字
        var material = new THREE.SpriteMaterial({ map: texture });
        var textObj = new THREE.Sprite(material);
        textObj.scale.set(100, 100, 100);
        textObj.position.set(4, -4, 1);
        this.groups.add(textObj);
        return this
    }
    addControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.addEventListener('change', () => {
            this.render(model)
        })
    }

    getTopTextCanvas() {
        let texts = [{
            name: "北京",
            value: 323
        }, {
            name: "杭州",
            value: 121
        }, {
            name: "南京",
            value: 56
        }]
        var width = 1000, height = 1000;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(80, 80, width, height);
        ctx.font = 100 + 'px " bold';
        ctx.fillStyle = 'red';
        texts.forEach((text, index) => {
            ctx.fillText(`${text.name}:${text.value}`, 10, 32 * index + 30);
        })
        // ctx.fillText('xxxx', 10, 20)
        // console.log(ctx, '----')
        return canvas;
    }

    getSprite() {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#0000ff";
        ctx.font = "20px Arial";
        ctx.lineWidth = 1;
        ctx.fillText("ABCDRE", 4, 20);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        //使用Sprite显示文字
        var material = new THREE.SpriteMaterial({ map: texture });
        var textObj = new THREE.Sprite(material);
        textObj.scale.set(1, 1, 1);
        textObj.position.set(4, -4, 1);
        this.groups.add(textObj);
    }
}


function Model1(options?: ModelOpts) {
    const {
        w = window.innerHeight,
        h = window.innerHeight
    } = options || {}
    this.w = w
    this.h = h
    this.k = w / h
    const s = 200
    this.scene = new THREE.Scene()

    const axes = new THREE.AxesHelper(w)
    this.scene.add(axes)

    this.groups = new THREE.Group()
    this.render = () => { }


}



const model = new Model()

// model.initCamera().initLight().getGeometry(
//     [[0, 0], [200, 0], [200, 80], [0, 80]]
// ).initRenderer().render(model.scene, model.camera)

model
    .initCamera()
    .initLight()
    .initRenderer()
    .getGeometry([[0, 0], [40, 0], [40, 30], [0, 30]])
    .render(model)
    .addControls()
// console.log(model, model.scene, model.camera, '----model')
