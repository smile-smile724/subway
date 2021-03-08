<template>
  <md-card>
    <md-card-media>
      <!-- swiper -->
      <swiper :options="swiperOption">
        <swiper-slide   v-for="models in modelsImg" :key="models.index">
          <img :src="models.img">
        </swiper-slide>
      </swiper>
    </md-card-media>
  </md-card>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
// require styles
import 'swiper/dist/css/swiper.css'
  export default {
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        swiperOption: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 0,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        },
        modelsImg:[
          {
            index:0,
            name:"地铁",
            img:require("../assets/index_btn01.png")
          },
          {
            index:1,
            name:"售货机",
            img:require("../assets/index_btn02.png")
          },
          {
            index:2,
            name:"花盆",
            img:require("../assets/index_btn03.png")
          },
          {
            index:3,
            name:"电梯",
            img:require("../assets/index_btn04.png")
          },
          {
            index:4,
            name:"敬请期待",
            img:require("../assets/so_on.png")
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .swiper-slide {
    width: 30%;
    margin-top:121px;
    transition-duration: 1s;
  }
  .swiper-slide-active{
    margin-top:0px;
    transition-duration: 1s;
  }
  .swiper-slide img{
    width:50px;
    text-align: center;
  }
  .swiper-slide-active img{
    width:120px;
    text-align: center;
  }
</style>
