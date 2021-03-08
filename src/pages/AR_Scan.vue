<template>
  <div class="main">
    <div class="top">
      <router-link to="/"><img src="../assets/back.svg"></router-link>
      <span>扫一扫</span>
    </div>
    <video ref="video" style="width: 100%;height:100%"></video>
      <div id="container"></div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证
import $ from 'jquery'
import html2canvas from 'html2canvas'
import * as THREE from '../build/three.module.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';
// const OrbitControls = require('three-orbit-controls')(THREE);
export default {
  name: 'AR_Scan',
  data() {
    return {
      position:'',
      loadingflag:false,
      sendflag:false,
      formData:null,
      postcode:0,
      cameraflag:false,
      $Blob:null,
      scene: '',
      light: '',
      camera: '',
      renderer: '',
      scalenum:1,
      scale:null
    }
  },
  watch:{
    'loadingflag':function (val) {
      this.$nextTick(function () {
          if(val==true){
            this.openCamera();
          }
      });
    },
    'sendflag':function (val) {
      var that=this;
      this.$nextTick(function () {
          if(val==true){
            that.formData = new window.FormData();
            that.formData.append('file',that.$Blob,"file_"+Date.parse(new Date())+".jpeg");
            that.formData.append('address',that.position);
            //组建XMLHttpRequest 上传文件
            var request = new XMLHttpRequest();
            //上传连接地址
            // that.$host +'/outsourcing/interface/model'"http://101.132.100.188:8080/test00001/upFile"
            request.open("POST",that.$host +'/outsourcing/interface/model' );
            request.onreadystatechange=function(){
                if (request.readyState==4){
                  var data=JSON.parse(request.responseText);
                  if(data.code==12){
                    var model=data.info;
                    that.init();
                    that.scale=model.scale;
                    // modelUrl.fbx="electric-elevator.fbx";
                    // modelUrl.png="elevator_alpha.png";
                    // modelUrl.alpha="electric-elevator.png";
                    that.loadObj(model);
                    that.animate();
                  }else{
                    alert(data.message);
                    that.sendflag=false;
                    that.postcode=0;
                  }
                }
            }
            request.send(that.formData);
          }

      });
    },
    'postcode':function (val) {
      this.$nextTick(function () {
          if(val==2){
            this.sendflag=true;
          }
      });
    },
    'cameraflag':function (val) {
      this.$nextTick(function () {
          if(val==true){
            var that=this;
            setInterval(function(){
              if(that.postcode==0){
                that.getPosition();
                that.screenCut();
              }
            },3000);
          }
      });
    },
  },
  methods: {
    loading:function(){
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
          // console.log(getUserMedia)
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            // return Promise.reject();
          }
          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }
      this.loadingflag=true;
    },
    //调用成功
    openCamera:function () {
      var that=this;
      let video = this.$refs.video
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { exact: "environment" }
        }
      }).then((stream) => {
        // 旧的浏览器可能没有srcObject
        if ('srcObject' in video) {
          video.srcObject = stream
        } else {
          // 防止在新的浏览器里使用它，应为它已经不再支持了
          video.src = window.URL.createObjectURL(stream)
        }
        video.onloadedmetadata = (e) => {
          video.play()
          that.cameraflag=true;
        }
      }).catch(() => {
        return Promise.reject(new Error('openCamera Error'))
      })
    },
    // 获取定位
    getLocation:function(){
      var that=this
      AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            console.log('通过ip获取当前城市：', result);
            // 逆向地理编码
            AMap.plugin('AMap.Geocoder', function () {
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode,
              });

              var lnglat = result.rectangle.split(';')[0].split(',');
              geocoder.getAddress(lnglat, function (status, data) {
                if (status === 'complete' && data.info === 'OK') {
                  // result为对应的地理位置详细信息
                  console.log(data);
                }
              });
            });
          }
        });
      });
    },
    // 获取当前位置
    getPosition:function() {
      const self = this;
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
            maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
            convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,         // 显示定位按钮，默认：true
            buttonPosition: 'LB',     // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,         // 定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,         // 定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,      // 定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true       // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);
        AMap.event.addListener(geolocation, 'error', onError);

        function onComplete (data) {
          // data是具体的定位信息
          console.log('定位成功信息：'+data.addressComponent);
          self.position = data.formattedAddress;
          self.postcode++;
        }

        function onError (data) {
          // 定位出错
          alert('定位失败错误：'+ data);
          // 调用IP定位
          self.getLocation();
        }
      });
    },
    screenCut:function(){
      var that=this;
      html2canvas(document.body).then(function(canvas) {
        document.body.appendChild(canvas);
        var imgData = canvas.toDataURL("image/jpeg");
        that.$Blob=that.getBlobBydataURI(imgData,"image/jpeg");
        that.postcode++;
      }).catch(function(error){
        alert(error)
      })
    },
    getBlobBydataURI:function (dataURI,type){
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type:type });
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
        this.camera = new THREE.PerspectiveCamera(500, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set( 30, 10,30 );
        this.camera.lookAt(this.scene.position);
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
        // this.renderer.setClearColor(0xffffff);
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
          this.camera.position.x /=this.scale;
          this.camera.position.y /=this.scale;
          this.camera.position.z /=this.scale;
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
    loadObj: function(model) {
          var color_pic = new THREE.TextureLoader().load(require('../../static/models/'+model.name+'/image.png'));//模型贴图
          if(model.alpha){
            var alpha_pic = new THREE.TextureLoader().load(require('../../static/models/'+model.name+'/image_alpha.png'));//模型贴图
          }else{
            var alpha_pic =null;
          }
          var loader = new FBXLoader();
          loader.load('../../../subway/static/models/'+model.name+'/'+model.id+'.fbx', obj => {
            obj.traverse( function ( child ) {
                var material = new THREE.MeshPhongMaterial({
                  map :color_pic,
                  alphaMap:alpha_pic,
                  transparent : true,
                });
                child.material=material;
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            obj.position.x=model.x;
            obj.position.y=model.y;
            obj.position.z=model.z;
            this.scene.add(obj);
          });
    }

  },
  mounted:function() {
    this.loading();
  }



}
</script>
<style scoped>
.main{
  width:100%;
  height:100%;
  position: relative;
  background-color:black;
}
.top{
  width:100%;
  height:48px;
  position: absolute;
  top:0;
  z-index:99;
}
.top a{
  width: 24px;
	height: 24px;
	left: 20px;
	top: 12px;
  position: absolute;
}
.top img{
  width: 24px;
	height: 24px;
}
.top span{
	height: 21px;
	margin-top: 15px;
  display: block;
  line-height:21px;
	text-align: center;
	font-weight: bold;
	letter-spacing: 4px;
	color: rgba(255, 195, 0, 1);
	font-size: 14px;
}
#container {
    width: 100vw;
    height: 100vh;
  }
video{
    width:100%;
    height:100%;
    position:absolute;
    float: left;
    padding:0;
    margin:0;
    top:0;
    left:0;
    z-index:9;
    background-color: aliceblue;
    object-fit:cover
}


  #container {
    width: 100vw;
    height: 100vh;
    position: absolute;
    z-index:88;
  }

</style>
