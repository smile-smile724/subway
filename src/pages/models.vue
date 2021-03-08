<template>
  <div class="main">
    <div class="models_bg">
      <img src="../assets/bg.png" v-show="$route.query.model!='sence'"/>
    </div>
    <div class="top">
      <div @click="Back()"><img src="../assets/blue_back.svg"></div>
      <span>{{$route.query.name}}</span>
    </div>
    <div id="notice" :style="'top:'+finishFlag+'px'">成就点+1</div>
    <div id="friend"  :style="{'right':(friendRight==false?'-80px':'0px')}" @click="friendRight=!friendRight">
      <span>求助好友</span>
    </div>
    <img src="../assets/bg2.png" id="Scan"  v-show="$route.query.model!='sence'">
    <div id="container"></div>
    <div id="achieve_progress" v-show="total-FinishNum>0">
      <img src="../assets/models_progress.svg">
      <span>{{total-FinishNum}}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证
import * as THREE from '../build/three.module.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';

import {DragControls} from './jsm/controls/DragControls.js';
// const OrbitControls = require('three-orbit-controls')(THREE);
export default {
  name: 'models',
  data() {
    return {
      scene: '',
      light: '',
      camera: '',
      renderer: '',
      raycaster:false,
      mouse:false,
      intersect:null,
      DragObj:[],
      ObjectPosition:[],
      fov:50,
      camera_position:{
        x:50,
        y:40,
        z:50
      },
      models_position:{
        x:0,
        y:-4,
        z:0
      },
      FinishNum:0,
      total:0,
      image:true,
      alpha:false,
      finishFlag:-48,
      friendRight:false,
      finish:false,
      obj:null,
      color_pic:null,
      alpha_pic:null,
      Scene:[
        {
          name:'bag-1',
          color:require('../../static/models/bag-1/image.png'),
          alpha:null,
          list:[
            {
              name:'bag3',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'bag4',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'bag-2',
          color:require('../../static/models/bag-2/image.png'),
          alpha:null,
          list:[
            {
              name:'bag1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'bag2',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'subway_ground',
          color:require('../../static/models/subway_ground/image.png'),
          alpha:null,
          list:[
            {
              name:'ground1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'headstock',
          color:require('../../static/models/headstock/image.png'),
          alpha:null,
          list:[
            {
              name:'subwayhead1',
              dragFlag:true,
              position:{
                x:8.305451818328265,
                y:-17.679558703290013,
                z:5.838195144303754
              }
            }
          ]
        },
        {
          name:'broad',
          color:require('../../static/models/broad/image.png'),
          alpha:null,
          list:[
            {
              name:'broad1',
              dragFlag:true,
              position:{
                x:10.883360704374049,
                y:-6.94166830125765,
                z:-5.330026063367882
              }
            }
          ]
        },
        {
          name:'cap',
          color:require('../../static/models/cap/image.png'),
          alpha:null,
          list:[
            {
              name:'cap1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'chair',
          color:require('../../static/models/chair/image.png'),
          alpha:null,
          list:[
            {
              name:'chair1',
              dragFlag:true,
              position:{
                x:12.372251490188212,
                y:-15.510292075962653,
                z:0.03598217058192432
              }
            },
            {
              name:'chair2',
              dragFlag:true,
              position:{
                x:11.973713810066513,
                y:-15.835683170652146,
                z:0.6948327264552105
              }
            },
            {
              name:'chair3',
              dragFlag:true,
              position:{
                x:6.5992965975391655,
                y:-1.5184907270361876,
                z:-5.384504015910217
              }
            }
          ]
        },
        {
          name:'elevator',
          color:require('../../static/models/elevator/image.png'),
          alpha:require('../../static/models/elevator/image_alpha.png'),
          list:[
            {
              name:'EE1',
              dragFlag:true,
              position:{
                x:-3.4869892213139053,
                y:-22.343498775353023,
                z:21.36178824159633
              }
            },{
              name:'EE2',
              dragFlag:true,
              position:{
                x:-2.127240874733502,
                y:-23.31967363169322,
                z:20.782979780088063
              }
            }
          ]
        },
        {
          name:'man',
          color:require('../../static/models/man/image.png'),
          alpha:null,
          list:[
            {
              name:'P1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'P3',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'women',
          color:require('../../static/models/women/image.png'),
          alpha:null,
          list:[
            {
              name:'P2',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'display_screen',
          color:require('../../static/models/display_screen/image.png'),
          alpha:null,
          list:[
            {
              name:'show1',
              dragFlag:true,
              position:{
                x:14.023924887471765,
                y:-26.24818876708244,
                z:6.9746261261942095
              }
            }
          ]
        },
        {
          name:'blue_trash_bin',
          color:require('../../static/models/blue_trash_bin/image.png'),
          alpha:null,
          list:[
            {
              name:'trash1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'red_trash_bin',
          color:require('../../static/models/red_trash_bin/image.png'),
          alpha:null,
          list:[
            {
              name:'trash2',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'vending_machine',
          color:require('../../static/models/vending_machine/image.png'),
          alpha:null,
          list:[
            {
              name:'sale1',
              dragFlag:true,
              position:{
                x:2.1857507307306463,
                y:-9.870188153462564,
                z:5.710399792039404
              }
            },
            {
              name:'sale2',
              dragFlag:true,
              position:{
                x:20.213920267461503,
                y:-29.827484519578746,
                z:3.6480673482014723
              }
            }
          ]
        },
        {
          name:'P4',
          color:require('../../static/models/sence/P3.png'),
          alpha:null,
          list:[
            {
              name:'P4',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'P5',
          color:require('../../static/models/sence/P5.png'),
          alpha:null,
          list:[
            {
              name:'P5',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'P6',
          color:require('../../static/models/sence/P4.png'),
          alpha:null,
          list:[
            {
              name:'P6',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'gate_machine',
          color:require('../../static/models/gate_machine/image.png'),
          alpha:require('../../static/models/gate_machine/image_alpha.png'),
          list:[
            {
              name:'BK1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'BK2',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'BK3',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'BK4',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'ticket_machine',
          color:require('../../static/models/ticket_machine/image.png'),
          alpha:null,
          list:[
            {
              name:'ticket1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'ticket2',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'ticket3',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'ticket4',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'potting',
          color:require('../../static/models/potting/image.png'),
          alpha:null,
          list:[
            {
              name:'plant1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'plant2',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'plant3',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        },
        {
          name:'rail',
          color:require('../../static/models/rail/image.png'),
          alpha:null,
          list:[
            {
              name:'railways1',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'railways2',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'railways3',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            },
            {
              name:'railways4',
              dragFlag:false,
              position:{
                x:0,
                y:0,
                z:0
              }
            }
          ]
        }
      ],
      SenceFlag:false
    }
  },
  methods: {
    getinfo(){
      axios({
        method: 'post',
        url: this.$host +'/outsourcing/interface/getposition',
        data:{
          modelsName:this.$route.query.model
        },
        transformRequest: [
          function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'));
              return ret
          }
        ],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        var data=response.data;
        if(data.code!=15){
          alert(data.message);
        }else{
          console.log(data);
          this.image=data.info.image;
          this.alpha=data.info.alpha;
          this.fov=data.info.fov;
          this.camera_position=data.info.modelP;
          this.models_position=data.info.objectP;
          this.ObjectPosition=data.info.positionList;
          this.init();
          if(this.image!=false){
            this.color_pic = new THREE.TextureLoader().load(require('../../static/models/'+this.$route.query.model+'/image.png'));//模型贴图
          }
          if(this.alpha!=false){
            this.alpha_pic = new THREE.TextureLoader().load(require('../../static/models/'+this.$route.query.model+'/image_alpha.png'));//模型贴图
          }
          if(!data.info.flag){
            if(data.info.total==-1||data.info.total==this.ObjectPosition.length){
              this.loadObj(this.$route.query.model+'/model.fbx',this.models_position);
            }else{
              for(var i=0;i<this.ObjectPosition.length;i++){
                this.ObjShow('../../static/models/'+this.$route.query.model+'/'+this.ObjectPosition[i].id+'.fbx',this.ObjectPosition[i].x,this.ObjectPosition[i].y,this.ObjectPosition[i].z);
              }
            }
            this.animate();
          }else{
            this.ObjShow(this.$route.query.model+'/model.fbx',this.models_position.x,this.models_position.y,this.models_position.z);
            this.animate();
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    getSence(){
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/queryScene'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=15){
          alert(data.message)
        }else{
          this.init();
          this.SenceFlag=data.info.flag;
          for(var i=0;i<this.Scene.length;i++){
            var colorP = new THREE.TextureLoader().load(this.Scene[i].color);//模型贴图
            if(this.Scene[i].alpha!=null){
              var alphaP = new THREE.TextureLoader().load(this.Scene[i].alpha);//模型贴图
            }else{
              var alphaP=null;
            }
            for(var j=0;j<this.Scene[i].list.length;j++){
              this.loadScene(this.Scene[i].list[j].name,colorP,alphaP,this.Scene[i].list[j].position,this.Scene[i].list[j].dragFlag) ;
            }
          }
          if(!this.SenceFlag){
            const dragControls = new DragControls(this.DragObj, this.camera, this.renderer.domElement);
          }
          this.animate();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    init: function() {
        this.scene = new THREE.Scene();
        this.light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				this.light.position.set( 0, 1, 0 );
				this.scene.add( this.light );
				this.light = new THREE.DirectionalLight( 0xffffff );
        this.light.position.set( 0, 1, 0 );
        this.scene.add( this.light );
        //初始化相机
        this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set( this.camera_position.x, this.camera_position.y,this.camera_position.z );
        this.camera.lookAt(this.scene.position);
        //初始化控制器
        this.raycaster=new THREE.Raycaster();
        this.mouse=new THREE.Vector2();
        window.addEventListener("touchmove",this.raycasterEvent,false);
        // helper
        // this.scene.add( new THREE.AxesHelper( 20 ) );
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
        this.renderer.setPixelRatio(window.devicePixelRatio);//为了兼容高清屏幕
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        // 记载到container
        const container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onWindowResize, false);//添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
    },
    onWindowResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate: function() {
        requestAnimationFrame(this.animate);
        this.render();
    },
    render: function() {
        this.renderer.render(this.scene,this.camera);
    },
    loadObj: function(url,position) {
          var that=this;
          var loader = new FBXLoader();
          loader.load('../../../subway/static/models/'+url, obj => {
            var that=this;
            var i,j;
            i=j=0;
            obj.traverse( function ( child ) {
                var material = new THREE.MeshPhongMaterial({
                  map :that.color_pic,
                  alphaMap:that.alpha_pic,
                  transparent : true
                });
                child.material=material;
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if(that.ObjectPosition[i].dragFlag){
                      that.DragObj[j]=child;
                      child.position.x=that.ObjectPosition[i].x;
                      child.position.y=that.ObjectPosition[i].y;
                      child.position.z=that.ObjectPosition[i].z;
                      j++;
                    }
                    i++;
                }
            });
            obj.position.x=position.x;
            obj.position.y=position.y;
            obj.position.z=position.z;
            this.scene.add(obj);
            this.total=this.DragObj.length;
            this.obj=obj;
            console.log(obj);
          })
          console.log(this.scene)
         const dragControls = new DragControls(this.DragObj, this.camera, this.renderer.domElement);
    },
    raycasterEvent:function (event){
				event.preventDefault();
				if(event.touches){
					this.mouse.x=(event.touches[0].pageX/window.innerWidth)*2-1;
					this.mouse.y=-(event.touches[0].pageY/window.innerHeight)*2+1;
				}else{
					this.mouse.x=(event.clientX/window.innerWidth)*2-1;
					this.mouse.y=-(event.clientY/window.innerHeight)*2+1;
				}
				this.raycaster.setFromCamera(this.mouse,this.camera);
        var intersect=this.raycaster.intersectObjects(this.DragObj,true);
        if(intersect[0]!=undefined){
          if(Math.abs(intersect[0].object.position.x)<=1&&Math.abs(intersect[0].object.position.y)<=1&&Math.abs(intersect[0].object.position.z)<=1){
            intersect[0].object.position.x=0;
            intersect[0].object.position.y=0;
            intersect[0].object.position.z=0;
            // console.log(1);
          }
          // console.log(intersect[0].object);
          // console.log(intersect[0].object.position);
          this.check();
        }
    },
    check:function(){
      var i,Num=0;
      for(i=0;i<this.DragObj.length;i++){
        if(this.DragObj[i].position.x==0&&this.DragObj[i].position.y==0&&this.DragObj[i].position.z==0){
          Num++;
        }
      }
      if(this.FinishNum!=Num){
        this.FinishNum=Num;
      }
      if(this.FinishNum==this.DragObj.length){
        this.finishFlag=0;
        this.finish=true;
        var that=this;
        var timer = setTimeout(function(){
          that.finishFlag=-48;
        }, 2000);
      }
    },
    ObjShow: function(url,x,y,z) {
          var that=this;
          var loader = new FBXLoader();
          loader.load('../../../subway/static/models/'+url, obj => {
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
          });
    },
    loadScene: function(url,color,alpha,position,dragFlag) {
          var that=this;
          var loader = new FBXLoader();
          loader.load('../../../subway/static/models/sence/'+url+'.fbx', obj => {
            var that=this;
            obj.traverse( function ( child ) {
                var material = new THREE.MeshPhongMaterial({
                  map :color,
                  alphaMap:alpha,
                  transparent : true
                });
                child.material=material;
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if(!that.SenceFlag){
                      if(dragFlag){
                        that.DragObj[that.DragObj.length]=child;
                      }
                      child.position.x=position.x;
                      child.position.y=position.y;
                      child.position.z=position.z;
                    }
                }
            });
            obj.position.x=0;
            obj.position.y=0;
            obj.position.z=0;
            this.scene.add(obj);
          })
    },
    Back(){
      if(this.$route.query.model=='sence'){
        this.$router.push(
          {
            path:'/Scanmodels',
            query:{name:'sence'}
          }
        )
      }else{
        this.$router.push(
          {
            path:'/Scanmodels',
            query:{name:'model'}
          }
        )
      }
    }
  },
  mounted() {
    if(this.$route.query.model=='sence'){
      this.getSence();
    }else{
      this.getinfo();
    }
  },
  watch:{
    'finish':function (val) {
      this.$nextTick(function () {
          if(val==true){
            if(this.$route.query.model!='sence'){
              axios({
                method: 'post',
                url: this.$host +'/outsourcing/interface/modelFlag',
                data:{
                  modelName:this.$route.query.model
                }
              })
              .then(response => {
                var data=response.data;
                if(data.code!=15){
                  alert(data.message);
                }else{
                  console.log(data);
                  this.scene.remove(this.obj);
                  this.ObjShow(this.$route.query.model+'/model.fbx',this.models_position.x,this.models_position.y,this.models_position.z);
                  this.animate();
                }
              })
              .catch(function (error) {
                console.log(error);
              });
            }else{
              axios({
                method: 'post',
                url: this.$host +'/outsourcing/interface/changeScene'
              })
              .then(response => {
                var data=response.data;
                if(data.code!=15){
                  alert(data.message);
                }else{
                  console.log(data.message);
                }
              })
              .catch(function (error) {
                console.log(error);
              });
            }
          }
      });
    }
  }
}
</script>

<style scoped>
.main,.models_bg{
  width:100%;
  height:100%;
  position: relative;
}
.models_bg img{
    width: 100%;
    height: 100%;
    display: block;
    z-index:0;
}
.top{
  width:100%;
  height:70px;
  position: absolute;
  top:0;
  z-index:10;
}
.top div{
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
	color: rgba(42, 130, 228, 1);
	font-size: 16px;
  display: block;
  line-height:24px;
	text-align: center;
	font-weight: bold;
}
#container {
    width: 100vw;
    height: 100vh;
    position:absolute;
    top:0;
    z-index:9;
}
#Scan{
  width: 300px;
	height: 170px;
  position: absolute;
	left: 50%;
  margin-left:-150px;
	top: 68.75%;
}
#achieve_progress{
  top:66%;
  left:82%;
  position: absolute;
}
#achieve_progress img{
  width:30px;
}
#achieve_progress span{
  display:block;
  position:absolute;
  top:0;
  width:30px;
  line-height:30px;
  color:white;
}
#notice{
  width: 360px;
	height: 48px;
  position: absolute;
	letter-spacing: 4px;
	color: rgba(28, 86, 151, 1);
	background-color: rgba(230, 238, 248, 0.9928571428571429);
	font-size: 14px;
	line-height: 48px;
	text-align: center;
  border-radius: 0px 0px 24px 24px;
  z-index:99;
  transition: all 2s;
}
#friend{
  width:100px;
	height: 32px;
	top: 98px;
	background-color: rgba(148, 189, 235, 1);
	border-radius: 16px 0px 0px 16px;
	text-indent: 15px;
  position: absolute;
  transition-duration: 1s;
  z-index:100;
}
#friend span{
	font-size: 15px;
	height: 32px;
	line-height: 32px;
  text-align: center;
	letter-spacing: 2px;
	color: rgba(76, 110, 146, 1);
}
</style>
