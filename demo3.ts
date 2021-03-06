/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GUOCHAO82
 * @Date: 2022-04-15 15:12:31
 * @LastEditors: GUOCHAO82
 * @LastEditTime: 2022-04-21 20:05:11
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
        // this.camera.position.set(0, -200, 400)
        // this.camera.lookAt(this.scene.position)
        // this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 5000);
        // this.camera.position.set(0, -40, 70);
        // this.camera.lookAt(this.scene.position);
        return this
    }


    initLight() {
        const point = new THREE.PointLight()
        const ambient = new THREE.AmbientLight(0x444444);
        this.scene.add(ambient);
        // const point = new THREE.DirectionalLight( 0xffffff, 0.5 ); 
        // point.position.set(0, 2000, 0)
        point.position.set(60, 100, 200);
        // const ambient = new THREE.AmbientLight('#fff');
        point.castShadow = true;
        point.shadow.mapSize.width = 1024;
        point.shadow.mapSize.height = 1024;
        // this.scene.add(ambient);
        this.scene.add(point)

        // const light = new THREE.DirectionalLight(0xffffff, 0.5);
        // light.position.set(20, 50, 20);
        // light.castShadow = true;
        // light.shadow.mapSize.width = 1024;
        // light.shadow.mapSize.height = 1024;

        // this.scene.add(light);

        return this
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        })
        // this.renderer.setClearColor('#fff', 1); //设置背景颜色
        // this.renderer.setSize(w, h)
        this.renderer.shadowMap.enabled = true; // 开启阴影
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;

        // 根据自己的需要调整颜色模式
        // this.renderer.outputEncoding = THREE.sRGBEncoding;  

        // this.renderer.outputEncoding = THREE.sHSVEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // 清除背景色，透明背景
        this.renderer.setClearColor(0xffffff, 0);
        this.renderer.setSize(this.w, this.h);
        document.body.appendChild(this.renderer.domElement)
        return this
    }

    getGeometry(points: [number, number][]) {
        const shape = new THREE.Shape()
        points.forEach((point, index) => {
            if (!index) {
                shape.moveTo(...point)
            } else {
                shape.lineTo(...point)
            }
        })

        const geometry = new THREE.ExtrudeGeometry(shape, {
            // steps: 2,
            // depth: 16,
            // bevelEnabled: true,
            // bevelThickness: 1,
            // bevelSize: 1,
            // bevelSegments: 1
            // amount: 8,
            depth: 40,
            bevelEnabled: true,
            // bevelSegments: 1,
            bevelThickness: 0.2
            // UVGenerator:
        })

        // const map = new THREE.TextureLoader().load("./xxx.jpg",(a)=>{
        //     console.log(a,'a')
        // },(e)=>{
        //     console.log(e,'---e')
        // },(e)=>{
        //     console.log(e,'error')
        // });
        // 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' 
        // const geometry = new THREE.SphereGeometry(20, 20, 20)
        // const geometry = new THREE.BoxGeometry(20, 20, 20)



        const materials = [
            new THREE.MeshPhongMaterial({
                // metalness: 1,
                // map: new THREE.CanvasTexture(this.getTopTextCanvas()),
                // map: new THREE.TextureLoader().load("./xxx.jpg")
                // map:new THREE.TextureLoader().load("./nx.jpg")
                // color: '#ffece8'
                map: this.getSprite()
            }),
            new THREE.MeshBasicMaterial({
                // metalness: 1,
                // roughness: 1,
                color: 'green',
            })
        ]



        // const materials = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture(this.getTopTextCanvas()) } ) // top
        const mesh = new THREE.Mesh(geometry, materials)
        this.groups.add(mesh)
        mesh.castShadow = true
        mesh.receiveShadow = true
        // mesh._color="#fff"
        // this.groups.add(mesh)
        // this.getSprite()
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
        canvas.width = 1000
        canvas.height = 1000
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.lineWidth = 1;
        ctx.fillText("ABCDRE", 4, 200);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        //使用Sprite显示文字
        // var material = new THREE.SpriteMaterial({ map: texture });
        // var textObj = new THREE.Sprite(material);
        // textObj.scale.set(100, 100, 100);
        // textObj.position.set(60, 15, -20);
        // this.groups.add(textObj);
        return texture

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
