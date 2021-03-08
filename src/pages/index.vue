<template>
  <div class="main">
    <div class="index_bg">
      <img :src="index_bg" />
    </div>
    <div class="user">{{$route.query.username?$route.query.username:username}}</div>
    <img src="../assets/light.png" id="light" @click="GoScanmodel">
    <div id="notice" :style="'top:'+finishFlag+'px'">{{award}}</div>
    <div id="back" :style="'right:'+backright+'px'"  v-show='$route.query.username' @click="backright=0">
      <router-link :to="{path:'/',query:{my:$route.query.my}}">
        <span @click="backright=-89;Imgflag=!Imgflag;">返回我的主页</span>
      </router-link>
    </div>
    <div id="RenWu" v-show='!$route.query.username' :style="{'right':(RenWuright==false?'-60px':'0px')}" @click="RenWuright=!RenWuright">
      <span @click="drawer2=true;RenWuright=!RenWuright">任务</span>
    </div>
    <div class="travel_btn" v-show='!$route.query.username'>
      <img src="../assets/index_btn01.png" style="margin-top:2px" id='friend'  @click="drawer = true" type="primary" >
      <router-link to="/AR_Scan"><img src="../assets/index_btn02.png" style="margin-top:7px"></router-link>
      <router-link to="/travel"><img src="../assets/index_btn03.png" style="margin-top:6px"></router-link>
      <router-link to="/achieve"><img src="../assets/index_btn04.png" style="margin-top:9px"></router-link>
    </div>
    <img :src="lionImg[index]" id='lion'>
    <!-- 好友列表 -->
    <el-drawer  :visible.sync="drawer" :with-header="false" size="280px">
      <span id="friend_top">好友</span>
      <ul id='Rank'>
          <li style="background-color: rgba(171, 227, 188, 0.6642857142857143);">
            <p id='rank' v-show="my.rank>3">{{my.rank}}</p>
            <img :src="rankImg[my.rank-1]" id='rank' v-show="my.rank<=3">
            <img :src="my.path" id="Head_Portrait">
            <p id='username'>{{my.username}}</p>
            <span style="margin-left:5px">LV.</span>
            <span style="margin-left:2px">{{my.level}}</span>
            <p id='model_num'>已建场景{{my.debris}}</p>
            <p id='point'>已获积分{{my.integral}}</p>
          </li>
          <li  v-for="person in persons" :key="person.rank">
            <p id='rank' v-show="person.rank>3">{{person.rank}}</p>
            <img :src="rankImg[person.rank-1]" id='rank' v-show="person.rank<=3">
            <img :src="person.path" id="Head_Portrait">
            <p id='username'>{{person.username}}</p>
            <span style="margin-left:5px">LV.</span>
            <span style="margin-left:2px">{{person.level}}</span>
            <p id='model_num'>已建场景{{person.debris}}</p>
            <p id='point'>已获积分{{person.integral}}</p>
            <router-link :to="{path:'/',query:{username:person.username,my:username}}"><img src="../assets/friend_btn.svg" @click="drawer=!drawer;backright=-89;Imgflag=!Imgflag;index=2"></router-link>
          </li>
      </ul>
    </el-drawer>
    <!-- 任务列表 -->
    <el-drawer  :visible.sync="drawer2" :with-header="false" size="280px">
      <span id="friend_top">任务</span>
      <div id="drawer2_box">
        <div>
          <span style="height:21px;margin-top:8px;display:block;color: rgba(73, 178, 143, 1);font-size: 15px;">当前积分</span>
          <span style="height:21px;display:block;color: rgba(255, 195, 0, 1);font-size: 18px;">{{point}}</span>
        </div>
      </div>
      <ul id="tasks">
        <li  v-for="task in tasks" :key="task.$index">
          <span id="tasksName">{{task.name}}</span>
          <span id="tasksInfo">{{task.info}}</span>
          <div id="tasksProgress" v-show="task.total!='-1'">
            <div id="progress" :style="'width:'+task.number/task.total*140+'px'"></div>
          </div>
          <div id="tasksFlag" :class="task.flag!=0?'tasks_finish':'tasks_unfinish'">{{task.flag!=0?'已完成':'待完成'}}</div>
        </li>
        <li></li>
        <li></li>
        <span  style="height:18px;display:block;color: rgba(166, 166, 166, 1);font-size: 13px;margin-top:6px;">已经到底了</span>
      </ul>
    </el-drawer>
  </div>
</template>


<script>
import axios from 'axios'
axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证
import $ from 'jquery'
export default {
  name: 'index',
  data () {
    return {
      point:10,
      username:null,
      drawer: false,
      drawer2:false,
      loginflag:false,
      rankImg:[require('../assets/first.png'),require('../assets/second.png'),require('../assets/third.png')],
      backright:-89,
      RenWuright:false,
      persons:[],
      my:{},
      Imgflag:false,
      lionImg:[
        require("../../static/flash/stand-1.gif"),
        require("../../static/flash/stand-2.gif"),
        require("../../static/flash/subway-1.gif"),
        require("../../static/flash/subway-2.gif")
      ],
      index:null,
      time:null,
      tasks:[],
      finishFlag:-48,
      index_bg:null,
      award:''
    }
  },
  mounted:function(){
    if(!this.$route.query.username){
      this.login();
    }
    var aData = new Date().getHours();
    if(aData>=18){
      this.index_bg=require("../assets/index_bg2.jpg");
    }else{
      this.index_bg=require("../assets/index_bg1.jpg");
    }
  },
  watch:{
    'loginflag':function (val) {
      this.$nextTick(function () {
          if(val==true){
            this.Getinfo();
            this.GetRank();
            this.GetTask();
            this.GetLionStatus();
          }
      });
    },
    'Imgflag':function(val){
      this.$nextTick(function () {
        if(val==false){
          this.GetLionStatus();
        }else{
          this.ChangeImg();
        }
      });
    }

  },
  methods:{
    login:function(){
      const that=this;
      axios({
        method: 'post',
        url: this.$host +'/outsourcing/interface/login',
        data: {
          account: '234567',
          password: 123456
        }
      })
      .then(response => {
        var data=response.data;
        if(data.code!=1){
          alert(data.message)
        }else{
          console.log(data.message);
          this.loginflag=true;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    Getinfo:function(){
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/getusername'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=15){
          alert(data.message)
        }else{
          console.log(data.message);
          this.username=data.info;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    GetRank:function(){
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/rank'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=15){
          alert(data.message)
        }else{
          console.log(data.message);
          for(var i=0;i<data.info.rank.length;i++){
            if(i!=0){
              this.persons[i-1]=data.info.rank[i];
              this.persons[i-1].rank=i;
              if(this.persons[i-1].username==this.my.username){
                this.my.rank=i;
              }
            }else if(i==0){
              this.my=data.info.rank[0];
            }
          }
          // console.log(data.info);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    ChangeImg:function(){
      var that=this;
      this.time=setTimeout(function(){
        if(that.index==2){
          that.index=3;
        }else if(that.index==0){
          that.index=1;
        }
      },2000);
    },
    GoScanmodel:function(){
      if(this.$route.query.username==undefined){
        this.$router.push(
          {
            path:'/Scanmodels',
            query:{name:'sence'}
          }
        )
      }
    },
    GetTask:function(){
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/task'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=15){
          alert(data.message)
        }else{
          this.tasks=data.info.task;
          this.point=data.info.integral;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    GetLionStatus:function(){
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/petState'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=12){
          alert(data.message)
        }else{
          if(data.info.atHome==true){
            this.index=0;
            if(data.info.award!=null){
              this.award=data.info.award;
              this.finishFlag=0;
              var that=this;
              var timer = setTimeout(function(){
                that.finishFlag=-48;
              }, 2000);
            }
          }else{
            this.index=2;
          }
          this.ChangeImg();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }


  }
}
</script>

<style scoped>
.main,.index_bg{
  width:100%;
  height:100%;
  position: relative;
  overflow: hidden;
}
.index_bg img{
    width: 100%;
    height: 100%;
    display: block;
}
.user{
  width: 100%;
	height: 48px;
	letter-spacing: 4px;
	color: rgba(81, 113, 148, 1);
	font-size: 14px;
	background-color: rgba(181, 205, 231, 0.6142857142857143);
	line-height: 48px;
	text-align: center;
  position: absolute;
  top:0;
}
#light{
  width:70.83%;
  height:19.6875%;
  position: absolute;
  left:14.72%;
  top:38.125%;
}
.travel_btn{
  width:100%;
  height:50px;
  position: absolute;
  bottom: 40px;
  text-align: center;
}
.travel_btn img{
  width: 50px;
}
.travel_btn a,#friend{
  display: inline-block;
  width: 50px;
	height: 50px;
  margin:0 15px;
}
#back,#RenWu{
	height: 32px;
	top: 98px;
	background-color: rgba(148, 189, 235, 1);
	border-radius: 16px 0px 0px 16px;
	text-indent: 15px;
  position: absolute;
  transition-duration: 1s;
}
#back{
  width: 110px;
}
#RenWu{
  width: 85px;
}
#back a{
	font-size: 12px;
	line-height: 32px;
	text-align: center;
	letter-spacing: 2px;
	color: rgba(76, 110, 146, 1);
  text-decoration: none;
}
#RenWu span{
	font-size: 15px;
	height: 32px;
	line-height: 32px;
  text-align: center;
	letter-spacing: 2px;
	color: rgba(76, 110, 146, 1);
}
#friend_top {
  display: block;
  width: 100%;
	height: 48px;
	background-color: rgba(73, 178, 143, 1);
	line-height: 48px;
	letter-spacing: 4px;
	color: rgba(255, 255, 255, 1);
	font-size: 14px;
	text-align: left;
	text-indent: 9px;
	font-weight: bold;
}
#Rank{
  width:100%;
  height:100%;
  list-style: none;
  overflow-y: auto;
  -webkit-overflow-scrolling:touch;
  padding:0;
  margin:0;
}
#Rank li{
  width: 100%;
	height: 80px;
	text-align: center;
  position: relative;
  border-bottom:1px solid rgba(202, 199, 199, 0.6570999999999999);
}
#rank{
  width: 24px;
	height: 24px;
	color: rgba(255, 195, 0, 1);
	font-size: 14px;
	line-height: 24px;
	text-align: center;
	font-weight: bold;
  margin:28px 9px;
  display: block;
  float: left;
}
#Head_Portrait{
  width: 45px;
	height: 45px;
  margin-top:15px;
  float: left;
	border-radius: 23px;
	border: rgba(222, 222, 222, 1) solid 3px;
}
#username{
	height: 21px;
  float: left;
  margin-top:19px;
  margin-left:8px;
	color: rgba(80, 80, 80, 1);
	font-size: 14px;
	line-height: 21px;
	text-align: left;
}
#Rank li span{
	height: 21px;
  float: left;
  margin-top:19px;
	color: rgba(255, 195, 0, 1);
	font-size: 14px;
	line-height: 21px;
	text-align: left;
	font-style: italic;
}
#model_num{
  width: 66px;
	height: 15px;
	letter-spacing: 2px;
	text-indent: 2px;
	color: rgba(255, 141, 26, 1);
	background-color: rgba(246, 234, 125, 1);
	border-radius: 5px;
	font-size: 10px;
  position: absolute;
  top:41px;
  right:118px;
	line-height: 15px;
	text-align: left;
}
#point{
  width: 72px;
	height: 15px;
	letter-spacing: 2px;
	text-indent: 4px;
	color: rgba(73, 178, 143, 1);
	background-color: rgba(144, 207, 163, 1);
	border-radius: 5px;
	font-size: 10px;
	line-height: 15px;
	text-align: left;
	top: 41px;
  position: absolute;
  right:40px;
}
#Rank li a,#Rank li a img{
  width: 24px;
	height: 24px;
}
#Rank li a{
  position: absolute;
  top:29px;
  right:8px;
  outline: none;
}
#lion{
  width:160px;
  position:absolute;
  top:51.56%;
  left:50%;
  margin-left:-70px;
}
#drawer2_box{
  width: 280px;
	height: 80px;
  background-color: rgba(171, 229, 189, 0.6642857142857143);
  position: relative;
}
#drawer2_box div{
  width: 250px;
	height: 64px;
	color: rgba(80, 80, 80, 1);
	background-color: rgba(255, 255, 255, 1);
	border-radius: 16px 16px 0 0;
  text-align: center;
  display: inline-block;
  margin:16px auto 0 auto;
  border-bottom:1px solid rgba(202, 199, 199, 0.6570999999999999);
}
#tasks{
  width:100%;
  padding:0;
}
#tasks li{
  height:69px;
  padding:18px 10px 0 25px;
  border-bottom:1px solid rgba(202, 199, 199, 0.6570999999999999);
  list-style: none;
	text-align: left;
  position: relative;
}
#tasks li span{
  display: block;
}
#tasksName{
	height: 26px;
	color: rgba(73, 178, 143, 1);
	font-size: 18px;
}
#tasksInfo{
  width: 173px;
	height: 15px;
	letter-spacing: 2px;
	text-indent: 2px;
	color: rgba(124, 206, 158, 1);
	border-radius: 5px;
  font-size: 10px;
  margin-top:4px;
}
#tasksFlag{
  width: 64px;
	height: 20px;
	letter-spacing: 2px;
	text-indent: 4px;
	border-radius: 5px;
	font-size: 14px;
  text-align: center;
  position: absolute;
  right:13px;
  top:36px;
}
#tasksProgress{
  width: 140px;
	height: 1px;
  background-color: rgba(233, 233, 233, 1);
  margin-top:6px;
}
#progress{
	height: 1px;
	background-color: rgba(73, 178, 143, 1);
}
.tasks_finish{
	color: rgba(255, 195, 0, 1);
	border: rgba(255, 195, 0, 1) solid 1px;
}
.tasks_unfinish{
	color: rgba(73, 178, 143, 1);
	border: rgba(73, 178, 143, 1) solid 1px;
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
  transition: all 2s;
}
</style>
