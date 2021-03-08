<template>
  <div class="main">
    <div class="top">
      <router-link to="/"><img src="../assets/back.svg" id="back"></router-link>
      <span>请选择目标站点</span>
      <img src="../assets/choose.svg" id="choose" @click="LionTravel">
    </div>
    <div id="notice" :style="'top:'+finishFlag+'px'">{{content}}</div>
    <div id="mysubway"></div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证
import $ from 'jquery'
export default {
  name: 'achieve',
  data () {
    return{
      mysubway:null,
      startInfo:{},
      endInfo:{},
      startName:'',
      endName:'',
      finishFlag:-48,
      content:'',
      loadMapFlag:false
    }
  },
  mounted:function(){
    // 加载地铁图
    this.loadMap();
  },
  watch:{
    'loadMapFlag':function (val) {
      this.$nextTick(function () {
          if(val==true){
            this.getinfo();
          }
      });
    }

  },
  methods:{
    getinfo(){
      const that=this;
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/petState',
      })
      .then(response => {
        var data=response.data;
        if(data.code==12){
          if(data.info.atHome==false){
            this.ShowMsg("宠物处于出游状态，返回时间："+data.info.time);
          }
        }else{
          alert(data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    loadMap(){
      var that=this;
      window.cbk = function(){
        that.mysubway = subway("mysubway", {
          adcode: 3301,
          theme: "colorful",
          client: 0,
          doubleclick: {
            switch: true
          }
        });
        //地铁加载完成，执行complete事件
        that.mysubway.event.on("subway.complete", function(ev, info) {
            console.log("地图加载成功");
            that.loadMapFlag=true;
        });
        //点击站点，显示此站点的信息窗体
        that.mysubway.event.on("station.touch", function(ev, info) {
            var id = info.id;
            that.mysubway.stopAnimation();
            that.mysubway.addInfoWindow(id, {});
            var center = that.mysubway.getStCenter(id);
            that.mysubway.setCenter(center);
        });
        //点击线路名，高亮此线路
        that.mysubway.event.on("lineName.touch", function(ev, info) {
            that.mysubway.showLine(info.id);
            var select_obj = qs('#g-select');
            that.mysubway.setFitView(select_obj);
            var center = that.mysubway.getSelectedLineCenter();
            that.mysubway.setCenter(center);
        });
        //点击空白, 关闭infowindow
        that.mysubway.event.on("subway.touch", function() {
            that.mysubway.clearInfoWindow();
        });

        //设置起点
        that.mysubway.event.on("startStation.touch", function(ev, info) {
            that.mysubway.stopAnimation();
            that.mysubway.clearInfoWindow();
            that.mysubway.setStart(info.id, {});
            that.startInfo = info;
            that.startName=info.name;
            route();
        });

        //设置终点
        that.mysubway.event.on("endStation.touch", function(ev, info) {
            that.mysubway.stopAnimation();
            that.mysubway.clearInfoWindow();
            that.mysubway.setEnd(info.id, {});
            that.endInfo = info;
            that.endName=info.name;
            route();
        });

        //路线规划
        function route() {
            if (that.startInfo.id && that.endInfo.id) {
                that.mysubway.route(that.startInfo.id, that.endInfo.id, {});
                that.startInfo={};
                that.endInfo={};
            }
        }
      };
      new Promise(function (resolve, reject){
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'http://webapi.amap.com/maps?v=1.4.15&key=2803b2c28ee0934aacc7d4eaf3f840c2'
        script.src = 'http://webapi.amap.com/subway?v=1.0&callback=cbk&key=2803b2c28ee0934aacc7d4eaf3f840c2'
        //script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      });
    },
    LionTravel(){
      if(this.endName!=''&&this.startName!=''){
        axios({
          method: 'post',
          url: this.$host +'/outsourcing/interface/petOuting'
        })
        .then(response => {
          var data=response.data;
          if(data.code==12){
            this.ShowMsg("宠物出游啦~");
          }else if(data.code==22){
            this.ShowMsg("宠物处于出游状态,无法再次出游");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }else{
        this.ShowMsg("请选择起点站和终点站！");
      }
    },
    ShowMsg(content){
      this.content=content;
      this.finishFlag=0;
      var that=this;
      var timer = setTimeout(function(){
        that.finishFlag=-48;
      }, 2000);
    }
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
  height:48px;
  position: absolute;
  top:0;
  z-index: 9;
  background-color: rgba(73, 178, 143, 1);
}
.top a {
  width: 24px;
	height: 24px;
}
#back{
	left: 20px;
	top: 12px;
  position: absolute;
}
#choose{
	right: 20px;
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
	color: rgba(255, 255, 255, 1);
	font-size: 14px;
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
  border-radius: 0 0 24px 24px;
  z-index:99;
  transition: all 2s ease;
}
</style>
