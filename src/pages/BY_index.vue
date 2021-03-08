<template>
  <div class="main">
    <div class="index_bg">
      <img src="../assets/index_bg1.jpg" />
    </div>
    <div class="user">
      <div class="user_pic">
        <img :src="user_pic">
      </div>
      <div class="user_level">
        <div id="model_num">{{user.debris}}</div>
        <div id="achievement_num">{{user.achievement}}</div>
      </div>
      <div class="user_degree">{{user.level}}</div>
    </div>
    <div class="travel_btn">
      <router-link to="/travel"><img src="../assets/TravelBtn.png"></router-link>
      <router-link to="/AR_Scan"><img src="../assets/TravelBtn.png"></router-link>
      <router-link to="/Rank"><img src="../assets/TravelBtn.png"></router-link>
      <router-link to="/achieve"><img src="../assets/TravelBtn.png"></router-link>
    </div>
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
      user:{
        id:null,
        username:null,
        password:null,
        debris:null,
        achievement:null,
        level:null
      },
      user_pic:null,
      loginflag:false
    }
  },
  mounted:function(){
    this.login();
  },
  watch:{
    'loginflag':function (val) {
      this.$nextTick(function () {
          if(val==true){
            this.Getinfo();
          }
      });
    },
    'user.level':function(){
      this.$nextTick(function () {
          this.GetPicture();
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
          username: 123456,
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
        method: 'post',
        url: this.$host +'/outsourcing/interface/getinfo'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=12){
          alert(data.message)
        }else{
          console.log(data.message);
          this.user=data.info;
          // console.log(data.info);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    GetPicture:function(){
      const that=this;
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/getpicture',
      })
      .then(response => {
        // console.log(response.data)
        var data=response.data;
        if(data.code==15){
          that.user_pic= that.$host + data.info.slice(20);
          // console.log(this.user_pic)
        }else{
          alert(data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },


  }
}
</script>

<style scoped>
.main,.index_bg{
  width:100%;
  height:100%;
  position: relative;
}
.index_bg img{
    width: 100%;
    height: 100%;
    display: block;
}
.user{
  position: absolute;
  left: 20px;
	top: 20px;
}
.user_pic img{
  width: 48px;
	height: 48px;
	border-radius: 25px;
	box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 9;
}
.user_level{
  width: 96px;
	height: 30px;
  position: absolute;
  z-index: 1;
	left: 24px;
	top: 19px;
	background-color: rgba(229, 229, 229, 0.65);
  border-radius: 0px 19px 19px 0px;
}
.user_degree{
  width: 20px;
	height: 25px;
  position: absolute;
  z-index: 10;
	left: 14px;
	top: 36px;
	color: rgba(255, 195, 0, 1);
	text-shadow: rgba(0, 0, 0, 0.5) 0px 2px 2px;
	font-size: 17px;
	line-height: 25px;
	text-align: left;
	font-weight: bold;
}
#model_num,#achievement_num{
	width: 24px;
	height: 24px;
	margin-top: 2px;
  text-align: center;
  line-height: 24px;
	color: rgba(255, 87, 51, 1);
	font-size: 15px;
	font-weight: bold;
  float: left;
}
#model_num{
	margin-left: 30px;
  background: url(../assets/model.svg) no-repeat;
  background-size: 24px 24px;
}
#achievement_num{
	margin-left: 6px;
  background: url(../assets/achievement.svg) no-repeat;
  background-size: 24px 24px;
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
	height: 50px;
	border-radius: 26px;
}
.travel_btn a{
  display: inline-block;
  width: 50px;
	height: 50px;
	border-radius: 26px;
  margin:0 15px;
	box-shadow: 0px 6px 6px 0px rgba(0, 0, 0, 0.5);
}

</style>
