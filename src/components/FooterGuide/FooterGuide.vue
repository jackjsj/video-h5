<template>
  <div class="footer" >
    <tabbar  style="background-color: black">
      <tabbar-item style="text-decoration:none;" :selected="$route.path === '/home'" link="/home">
        <img slot="icon" :src="$route.path === '/home'?require('./img/home_active.png'):require('./img/home.png')">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item style="text-decoration:none;" :selected="$route.path === '/banner'" link="/banner">
        <img slot="icon" :src="$route.path === '/banner'?require('./img/banner_active.png'):require('./img/banner.png')">
        <span slot="label">频道</span>
      </tabbar-item>
      <tabbar-item style="text-decoration:none;" :selected="$route.path === '/caricatureList'" link="/caricatureList">
        <img slot="icon" :src="$route.path === '/caricatureList'?require('./img/caricature_active.png'):require('./img/caricature.png')">
        <span slot="label">漫画</span>
      </tabbar-item>
      <tabbar-item style="text-decoration:none;" :selected="$route.path === '/star'" link="/star">
        <img slot="icon" :src="$route.path === '/star'?require('./img/star_active.png'):require('./img/star.png')">
        <span slot="label">明星</span>
      </tabbar-item>
      <tabbar-item style="text-decoration:none;" :selected="$route.path === '/rankingList'" link="/rankingList">
        <img slot="icon" :src="$route.path === '/rankingList'?require('./img/rankingList_active.png'):require('./img/rankingList.png')">
        <span slot="label">排行</span>
      </tabbar-item>
      <tabbar-item style="text-decoration:none;" :selected="$route.path === '/personalCenter'" link="/personalCenter">
        <img slot="icon"  :src="$route.path === '/personalCenter'?require('./img/user_active.png'):require('./img/user.png')">
        <span  slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'

  export default {
    data() {
      return {
        homeIcon: require('./img/home.png')
      }
    },
    components: {
      TabbarItem,
      Tabbar
    },
    methods: {
      goto(path) {
        this.$router.replace(path);
      }
    }
  }
</script>

<style scoped>
  .footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #252628;
  }
  .footer tabbar {
    margin-top: 5rem;
    position: fixed;
    bottom: -5rem;
  }

  .footer tabbar a {
    font-size: 100%;
    display: block;
    text-align: center;
    /*color: floralwhite;*/
    text-decoration:none;

  }

  .footer tabbar a:hover{
    font: bold 14px Georgia;
    text-decoration: none;
  }
</style>
