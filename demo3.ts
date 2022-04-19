/*
 * @Description: 
 * @Version: 2.0
 * @Autor: GUOCHAO82
 * @Date: 2022-04-15 15:12:31
 * @LastEditors: GUOCHAO82
 * @LastEditTime: 2022-04-15 15:40:20
 */

import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Face3, Geometry } from "three/examples/jsm/deprecated/Geometry";
import { Earcut } from 'three/src/extras/Earcut'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;


function drawmesh() {
    var material = new THREE.MeshStandardMaterial( { color : 0x00cc00 } );

    //创建仅有一个三角面片的几何体
    var geometry = new Geometry();
    geometry.vertices.push( new THREE.Vector3( -50, -50, 0 ) );
    geometry.vertices.push( new THREE.Vector3(  50, -50, 0 ) );
    geometry.vertices.push( new THREE.Vector3(  50,  50, 0 ) );
    
    //利用顶点 0, 1, 2 创建一个面
    var normal = new THREE.Vector3( 0, 1, 0 ); //optional
    var color = new THREE.Color( 0xffaa00 ); //optional
    var materialIndex = 0; //optional
    var face = new Face3( 0, 1, 2, normal, color, materialIndex );
    
    //将创建的面添加到几何体的面的队列
    geometry.faces.push( face );
    
    //如果没有特别指明，面和顶点的法向量可以通过如下代码自动计算
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    
    scene.add( new THREE.Mesh( geometry.toBufferGeometry(), material ) );
}

drawmesh();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
