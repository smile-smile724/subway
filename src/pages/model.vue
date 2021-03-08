<template>
  <div class="main">
    <div class="top">
      <router-link to="/"><img src="../assets/back.svg"></router-link>
    </div>
      <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from '../build/three.module.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';
// const OrbitControls = require('three-orbit-controls')(THREE);
export default {
  name: 'models',
  data() {
    return {
      scene: '',
      light: '',
      camera: '',
      renderer: '',
      scalenum:1,
      flag:false,
      obj:null,
      color_pic:null,
      alpha_pic:null
    }
  },
  methods: {
    init: function() {
        this.scene = new THREE.Scene();
        this.light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				this.light.position.set( 0, 1, 0 );
				this.scene.add( this.light );
				this.light = new THREE.DirectionalLight( 0xffffff );
        this.light.position.set( 0, 1, 0 );
        this.scene.add( this.light );
        //初始化相机
        this.camera = new THREE.PerspectiveCamera(500, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set( 30, 10,30 );
        this.camera.lookAt(this.scene.position);
        this.scene.add( new THREE.AxesHelper( 20 ) );
        //渲染
        this.renderer = new THREE.WebGLRenderer({
          antialias: true, // true/false表示是否开启反锯齿
          alpha: true, // true/false 表示是否可以设置背景色透明
          precision: 'highp', // highp/mediump/lowp 表示着色精度选择
          premultipliedAlpha: false, // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
          preserveDrawingBuffer: true, // true/false 表示是否保存绘图缓冲
          maxLights: 3, // 最大灯光数
          stencil: false // false/true 表示是否使用模板字体或图案
        });
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        // 记载到container
        const container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onWindowResize, false);//添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
    },
    //窗口监听函数
    onWindowResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
    animate: function() {
        requestAnimationFrame(this.animate);
        if(this.scalenum<100){
          this.camera.position.x /=1.01;
          this.camera.position.y /=1.01;
          this.camera.position.z /=1.01;
          this.scalenum++;
        }else{
          this.scene.rotation.y += 0.005;
        }
        this.render();
    },
    render: function() {
        this.renderer.render(this.scene,this.camera);
      },
    //外部模型加载函数
    loadObj: function(url,x,y,z) {
          // var color_pic = new THREE.TextureLoader().load(color);//模型贴图
          // if(alpha!=null){
          //   var alpha_pic = new THREE.TextureLoader().load(alpha);//模型贴图
          // }else{
          //   var alpha_pic =null;
          // }
          var that=this;
          var loader = new FBXLoader();
          loader.load(url, obj => {
            obj.traverse( function ( child ) {
                var material = new THREE.MeshPhongMaterial({
                  map :that.color_pic,
                  alphaMap:that.alpha_pic,
                  transparent : true,
                });
                child.material=material;
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            obj.position.x=x;
            obj.position.y=y;
            obj.position.z=z;
            this.scene.add(obj);
            console.log(obj)
            this.obj=obj;
          });
          var that=this;
      // var time=setTimeout(function(){
      //   if(!that.flag){
      //     that.flag=!that.flag;
      //   }
      // },2000);
    }

  },
  mounted() {
      this.init();
      this.color_pic = new THREE.TextureLoader().load(require("../../static/models/headstock/image.png"));//模型贴图
      for(var i=0;i<=25;i++){
        this.loadObj('../../static/models/headstock/'+i+'.fbx',0,0,0);
      }
      // this.loadObj('../../static/models/headstock/model.fbx',null,require("../../static/models/headstock/image.png"),0,0,0.5);
      this.animate();
  },
  watch:{
    // 'flag':function (val) {
    //   this.$nextTick(function () {
    //       if(val==true){
    //         this.scene.remove(this.obj)
    //         this.loadObj('../../static/models/vending_machine/model.fbx',null,require("../../static/models/vending_machine/image.png"),0,0,5);
    //       }
    //   });
    // }

  },
}
</script>
<style scoped>
.main{
  width:100%;
  height:100%;
  position: relative;
}
.top{
  width:100%;
  height:70px;
  position: absolute;
  top:0;
}
.top a{
  width: 30px;
	height: 30px;
	left: 20px;
	top: 20px;
  position: absolute;
}
.top img{
  width: 30px;
	height: 30px;
}
.top span{
	height: 24px;
	margin-top: 23px;
	color: rgba(255, 87, 51, 1);
	font-size: 16px;
  display: block;
  line-height:24px;
	text-align: center;
	font-weight: bold;
}
  #container {
    width: 100vw;
    height: 100vh;
  }
</style>
