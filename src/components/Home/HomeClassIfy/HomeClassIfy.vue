<template>
  <div class="iconContainer">
    <div class="icon" v-for="(classify,index) in classifyList"
         :index="index">
      <a href="javaScript:" @click="toMovieClassifyListPage(classify.id,index)" >
        <img :src="classify.classifyIcon" alt="">
        <span style="color: #959697">{{classify.name}}</span>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HomeClassIfy",
    props: {
      classifyList: Array
    },
    methods: {
      toMovieClassifyListPage(classifyId,index){
        this.$router.push(`/movieClassifyList/${classifyId}/${index}/0`);
      }
    }
  }
</script>

<style scoped>
  /*图标*/
  .iconContainer .icon {
    width: 24%;
    display: inline-block;
    margin: 10px auto;


  }

  .iconContainer .icon img {
    display: block;
    margin: 0 auto;
    width: 50%;
  }

  .iconContainer .icon span {
    display: block;
    text-align: center;
  }

  /*鼠标移入*/
  .iconContainer .icon a, .contentContainer .classifyContainer .title a, .footerPosition a {
    color: floralwhite;
    font: bold 14px Georgia;
    text-decoration: none;
  }

  .iconContainer .icon a:hover, .contentContainer .classifyContainer .title a:hover, .footerPosition a:hover {
    font: bold 14px Georgia;
    text-decoration: none;
  }
</style>
