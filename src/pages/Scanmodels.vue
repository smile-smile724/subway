<template>
  <div class="main">
    <div class="StorageRack_bg">
      <img src="../assets/StorageRack_bg.png" >
    </div>
    <div class="top">
      <div @click="Back()"><img src="../assets/back.svg" id="back"></div>
      <!-- <span>储物架</span> -->
    </div>
    <img src="../assets/light.png" id="light">
    <span id="pic_name">{{modelsImg[index].name}}</span>
    <!-- swiper -->
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide   v-for="models in modelsImg" :key="models.index">
          <img :src="models.path" v-show="models.name=='敬请期待'">
          <div v-show="models.name!='敬请期待'" @click="Gotomodel(models.model,models.name)">
            <img :src="models.path">
            <span id="point" v-show="models.status!=0"></span>
          </div>
        </swiper-slide>
        <!-- <div class="swiper-pagination" slot="pagination"></div> -->
      </swiper>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证
import $ from 'jquery'
import { swiper, swiperSlide } from "vue-awesome-swiper";
// require styles
import 'swiper/dist/css/swiper.css'
export default {
  name: 'achieve',
  components: {
      swiper,
      swiperSlide
  },
  data () {
    return{
      swiperOption: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 0,
          pagination: {
            el: '.swiper-pagination',
            type: 'fraction'
          },
          on: {
				      slideChangeTransitionEnd: ()=>{
				        // 通过$refs获取对应的swiper对象
                  let swiper = this.$refs.mySwiper.swiper;
					        this.index= swiper.activeIndex;
				      }
          }
        },
      modelImg:[
          {
            index:0,
            name:"地铁",
            model:'headstock',
            status:0,
            path:require("../../static/models/headstock/logo.png")
          },
          {
            index:1,
            name:"显示屏",
            model:'display_screen',
            status:0,
            path:require("../../static/models/display_screen/logo.png")
          },
          {
            index:2,
            name:"闸机",
            model:'gate_machine',
            status:1,
            path:require("../../static/models/gate_machine/logo.png")
          },
          {
            index:3,
            name:"轨道",
            model:'rail',
            status:1,
            path:require("../../static/models/rail/logo.png")
          },
          {
            index:4,
            name:"自动贩卖机",
            model:'rail',
            status:1,
            path:require("../../static/models/vending_machine/logo.png")
          },
          {
            index:5,
            name:"售票机",
            model:'ticket_machine',
            status:1,
            path:require("../../static/models/ticket_machine/logo.png")
          },
          {
            index:6,
            name:"女士",
            model:'women',
            status:1,
            path:require("../../static/models/women/logo.png")
          },
          {
            index:7,
            name:"男士",
            model:'man',
            status:1,
            path:require("../../static/models/man/logo.png")
          },
          {
            index:8,
            name:"敬请期待",
            path:require("../assets/so_on.png")
          },
      ],
      SceneImg:[
          {
            index:0,
            name:"地铁站",
            model:'sence',
            status:0,
            path:require("../../static/models/sence/logo.png")
          },
          {
            index:1,
            name:"敬请期待",
            path:require("../assets/so_on.png")
          },
      ],
      modelsImg:null,
      index:0,
      flag:false
    }
  },
  mounted:function(){
    if(this.$route.query.name=='sence'){
      this.getinfo();
      this.modelsImg=this.SceneImg;
    }else if(this.$route.query.name=='model'){
      this.modelsImg=this.modelImg;
    }
  },
  methods:{
    getinfo(){
      axios({
        method: 'get',
        url: this.$host +'/outsourcing/interface/queryScene'
      })
      .then(response => {
        var data=response.data;
        if(data.code!=15){
          alert(data.message)
        }else{
          this.flag=data.info.collect;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    Gotomodel(model,name){
      if(this.$route.query.name=='sence'){
        if(!this.flag){
          this.$router.push({
            path:'/Scanmodels',
            query:{name:'model'}
          })
          this.$router.go(0)
        }else{
          this.$router.push({
            path:'/models',
            query:{model:model,name:name}
          })
        }
      }else if(this.$route.query.name=='model'){
        this.$router.push(
          {
            path:'/models',
            query:{model:model,name:name}
          }
        )
      }
    },
    Back(){
      if(this.$route.query.name=='sence'){
        this.$router.push(
          {
            path:'/'
          }
        )
      }else if(this.$route.query.name=='model'){
        this.$router.push(
          {
            path:'/Scanmodels',
            query:{name:'sence'}
          }
        )
        this.$router.go(0)
      }
    }
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
.swiper-container{
    width:88%;
    position:absolute;
    left:6%;
    top:200px;
}
.swiper-slide {
    width:33.3%;
    margin-top:121px;
    transition-duration: 1s;
}
.swiper-slide-active{
    margin-top:0px;
    transition-duration: 1s;
}
.swiper-slide img{
    width:70px;
}
.swiper-slide-active img{
    width:120px;
}
#point{
  width: 12px;
	height: 12px;
	background-color: rgba(247, 61, 52, 1);
  top:0;
  right:0;
  display: block;
	border-radius: 7px;
  position: absolute;
}
</style>
