<template>
  <div class="main">
    <div class="StorageRack_bg">
      <img src="../assets/StorageRack_bg.png" />
    </div>
    <div class="top">
      <router-link to="/"><img src="../assets/back.svg" id="back"></router-link>
      <!-- <span>储物架</span> -->
    </div>
    <img src="../assets/light.png" id="light">
    <span id="pic_name">{{pic_list[index].name}}</span>
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
      pic_list:[
        {
          id:0,
          name:'smile',
          pic:require('../assets/index_btn03.png')
        },
        {
          id:1,
          name:'hai',
          pic:require('../assets/index_btn03.png')
        }
      ],
      index:1
    }
  },
  mounted:function(){

  }
}
</script>

<style scoped>
.main,.StorageRack_bg{
  width:100%;
  height:100%;
  position: relative;
}
.StorageRack_bg img{
    width: 100%;
    height: 100%;
    display: block;
}
.top{
  width:100%;
  height:70px;
  position: absolute;
  top:0;
  z-index: 9
}
.top a {
  width: 30px;
	height: 30px;
}
#back{
	left: 20px;
	top: 20px;
  position: absolute;
}
#choose{
	right: 20px;
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
#light{
  width:100%;
  height:41.25%;
  position: absolute;
  top:42.8125%;
  left:0;
  z-index:99;
}
#pic_name{
  position:absolute;
  width: 100%;
	height: 54px;
	top: 18.75%;
  left:0;
	letter-spacing: 4px;
	color: rgba(42, 130, 228, 1);
	font-size: 16px;
	line-height: 54px;
	text-align: center;
	font-weight: bold;
}
</style>
