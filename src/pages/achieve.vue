<template>
  <div class="main">
    <div class="top">
      <router-link to="/"><img src="../assets/back.svg"></router-link>
      <span>成就榜</span>
    </div>
    <ul class='achieve'>
      <li v-for="achievement in achievements" :key="achievement.id">
        <img :src="achievement.path">
        <div id="word">
          <span id='achieve_name'>{{achievement.name}}</span>
          <span id='achieve_text'>{{achievement.intro}}</span>
          <span id='achieve_time'>{{achievement.date}}</span>
          <span id='achieve_progress'><span>{{achievement.number}}</span><span>/</span><span>{{achievement.total}}</span></span>
          <div id='both'>
            <div id="get" :style="'width:'+achievement.number/achievement.total*141+'px'"></div>
          </div>
        </div>
      </li>
      <li style="height:16px;"></li>
    </ul>
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
      achievements:[]
    }
  },
  methods:{
    GetInfo:function(){
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/achievement'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=15){
          alert(data.message)
        }else{
          console.log(data)
          this.achievements=data.info;
          for(var i=0;i<this.achievements.length;i++){
            this.achievements[i].id=i+1;
            if(this.achievements[i].number!=0){
              this.achievements[i].path=require("../../static/achieveImg/achieve/"+this.achievements[i].path);
            }else{
              this.achievements[i].path=require("../../static/achieveImg/unachieve/"+this.achievements[i].path);
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted:function(){
    this.GetInfo();
  }
}
</script>

<style scoped>
.main{
  width:100%;
  min-height:100%;
  position: relative;
  background-color: rgba(73, 178, 143, 1);
}
.top{
  width:100%;
  height:48px;
  position: absolute;
  top:0;
  z-index: 100;
  background-color: rgba(73, 178, 143, 1);
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
	letter-spacing: 4px;
	color: rgba(255, 255, 255, 1);
	font-size: 14px;
	text-align: center;
	font-weight: bold;
}
.achieve{
  width:100%;
  height:100%;
  overflow-y: auto;
  -webkit-overflow-scrolling:touch;
  list-style: none;
  position: absolute;
  top:0;
  z-index: 10;
  padding:0;
}
.achieve li{
  width: 336px;
	height: 169px;
	background-color: rgba(246, 252, 248, 1);
	border-radius: 16px;
	box-shadow: 0px 6px 6px 0px rgba(229, 229, 229, 1);
	text-align: center;
  margin:48px auto -16px auto;
}
.achieve li img{
  width: 100px;
  height:100px;
	margin:34px 38px 0 30px;
  float: left;
}
#word{
	height: 145px;
	margin-top: 12px;
  float: left;
	text-align: left;
}
#word span{
  display: block;
}
#achieve_name{
	height: 30px;
	letter-spacing: 4px;
	color: rgba(255, 195, 0, 1);
	font-size: 20px;
	line-height: 30px;
}
#achieve_text{
  width: 148px;
	height: 47px;
	color: rgba(128, 128, 128, 1);
	font-size: 10px;
	line-height: 16px;
	text-align: left;
  margin-top:4px;
}
#achieve_time{
	height: 18px;
  margin-top:4px;
	color: rgba(166, 166, 166, 1);
	font-size: 10px;
	line-height: 18px;
	text-align: left;
}
#achieve_progress{
	height: 21px;
  margin-top:6px;
	color: rgba(73, 178, 143, 1);
	font-size: 14px;
	line-height: 21px;
	text-align: left;
}
#achieve_progress span{
  float: left;
  padding:0 2px 0 0;
}
#both,#get{
	height: 1px;
	text-align: center;
}
#both{
  width: 141px;
  margin-top:3px;
	background-color: rgba(233, 233, 233, 1);
}
#get{
	background-color: rgba(26, 173, 25, 1);
}
</style>
