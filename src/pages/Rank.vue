<template>
  <div class="main">
    <div class="Rank_bg">
      <img src="../assets/Rank_bg.jpeg" />
    </div>
    <div class="top">
      <router-link to="/"><img src="../assets/back.svg"></router-link>
      <span>好友积分榜</span>
    </div>
    <ul class="rank">
      <li>
        <h1>{{my.rank}}</h1>
        <img :src="my.path" id="Head_Portrait">
        <span>{{my.username}}</span>
        <h2>已获得积分</h2>
        <h3>{{my.level}}</h3>
      </li>
      <li v-for="person in persons" :key="person.rank">
        <h1>{{person.rank}}</h1>
        <img :src="person.path" id="Head_Portrait">
        <span>{{person.username}}</span>
        <h2>已获得积分</h2>
        <h3>{{person.level}}</h3>
        <img src="../assets/next.svg" id="next">
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证
export default {
  name: 'Rank',
  data () {
    return {
      persons:[],
      my:{}
    }
  },
  mounted:function(){
    this.Getinfo();
  },
  methods:{
    Getinfo:function(){
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
              this.persons[i-1].path= this.$host + this.persons[i-1].path.slice(20);
              if(this.persons[i-1].username==this.my.username){
                this.my.rank=i;
              }
            }else if(i==0){
              this.my=data.info.rank[0];
              this.my.path= this.$host + this.my.path.slice(20);
            }
          }
          // console.log(data.info);
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
.main,.Rank_bg{
  width:100%;
  height:100%;
  position: relative;
}
.Rank_bg img{
    width: 100%;
    height: 100%;
    display: block;
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
.rank{
  width: 100%;
  height:100%;
  list-style:none;
  position: absolute;
  top:60px;
  padding:0;
  margin:0;
  overflow-y: auto;
  -webkit-overflow-scrolling:touch;
}
.rank li{
  width: 100%;
	height: 50px;
  margin: 20px 0;
	background-color: rgba(229, 229, 229, 0.2214285714285714);
	font-size: 14px;
  border-radius: 0px 16px 16px 0px;
  text-align: left;
  display:block;
}
.rank li h1{
  width: 20px;
	height: 21px;
	margin-left: 20px;
	margin-top: 15px;
	color: rgba(210, 100, 100, 1);
	font-size: 14px;
	line-height: 21px;
	text-align: center;
	font-weight: bold;
  display: inline-block;
  float: left;
}
#Head_Portrait{
  width: 40px;
	height: 40px;
	margin-left: 10px;
	margin-top: 5px;
	border-radius: 20px;
	border: rgba(210, 100, 100, 1) solid 1px;
	box-shadow: 0px 0px 11px 0px rgba(210, 100, 100, 1);
  display: inline-block;
  float: left;
}
.rank li span{
  width:68px;
	height: 18px;
	margin-left: 11px;
	margin-top: 5px;
	color: rgba(80, 80, 80, 1);
	font-size: 12px;
	line-height: 18px;
	text-align: left;
  float: left;
}
.rank li h2,.rank li h3{
	height: 20px;
	color: rgba(212, 48, 48, 1);
	line-height:20px;
	font-size: 12px;
	text-align: left;
	font-style: italic;
  float: left;
  font-weight: normal;
}
.rank li h2{
  width: 65px;
	margin-left: 11px;
	margin-top: 15px;
}
.rank li h3{
  width: 45px;
	margin-top: 15px;
}
#next{
  width: 30px;
	height: 30px;
	margin-left: 10px;
	margin-top: 10px;
	font-size: 30px;
}
</style>
