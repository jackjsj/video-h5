<template>
  <div>
    <div class="banner">
      <swiper :loop="true" :aspect-ratio="300/800" v-if="bannerList">
        <swiper-item class="swiper-demo-img" v-for="(banner,index) in bannerList" :key="index">
          <img @click="test(index)" :src="banner.picUrl" class="bannerImg">
        </swiper-item>
      </swiper>
    </div>

  </div>
</template>

<script>
  import { Swiper, GroupTitle, SwiperItem, XButton, Divider } from 'vux'


  export default {
    components: {
      Swiper,
      SwiperItem,
      GroupTitle,
      XButton,
      Divider
    },
    props: {
      bannerList: Array
    },
    methods: {
      test(index){
        console.log(index)
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style scoped>
  .banner{
    margin-top: 20%;
  }

  .bannerImg{
    width: 100%;
    height: 100%;
    border-radius:36px;
  }

  .copyright {
    font-size: 12px;
    color: #ccc;
    text-align: center;
  }
  .text-scroll {
    border: 1px solid #ddd;
    border-left: none;
    border-right: none;
  }
  .text-scroll p{
    font-size: 12px;
    text-align: center;
    line-height: 30px;
  }
  .black {
    background-color: #000;
  }
  .title{
    line-height: 100px;
    text-align: center;
    color: #fff;
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  .vux-indicator.custom-bottom {
    bottom: 30px;
  }
  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
    100% {
      opacity: 1;
      transform: none;
    }
  }
  .fadeInUp {
    animation-name: fadeInUp;
  }
  .swiper-demo-img img {
    width: 100%;
  }
</style>
