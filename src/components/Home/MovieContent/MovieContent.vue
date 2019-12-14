<template>
  <div class="contentContainer">
    <div class="classifyContainer">
      <div class="title">
        <span style="color: #FFFFFF">{{title}}</span>
        <a href="javascript:void(0)"  @click="toClassifyListPage"> 更多> </a>
      </div>
      <div class="movieContainer">
        <div class="movie"  v-for="(video,index) in videoList.slice(0,4)" :key="index">
          <a href="javaScript:void(0)" @click="toMoviePage(`${video.id}`)">
            <img :src="video.videoCover" alt="">
            <span style="color: #959697">{{video.videoName}}</span>
          </a>
        </div>
      </div>
      <div v-if="videoList.length >= 4" class="AdvertisementContainer">
        <div class="Advertisement">
          <a href="javascript:void(0)" @click="toMoviePage(`${videoList[4].id}`)">
            <img :src="videoList[4].videoCover" style=" height: 180px">
            <span>{{videoList[4].videoName}}</span>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "Content",
    props: {
      title: String,
      videoList: Array,
      index: Number,
      classifyId: Number,
      isClassIfyGoto: Boolean, // 是否分类跳转
      orderType: Number // 排序类型
    },
    methods: {

      toMoviePage(id){
        this.$router.push(`/video/${id}`);
      },
      // 跳转分类页面
      toClassifyListPage(){

        const isClassIfyGoto = this.isClassIfyGoto; // 是否为分类查询跳转

        const path = isClassIfyGoto? `/movieClassifyList/${this.classifyId}/${this.index}/1`:`/movieClassifyList/-1/-1/${this.orderType}`;

        this.$router.push(path);
      }


    }
  }
</script>

<style scoped>
  /*主内容*/
  .contentContainer .classifyContainer .title a, .footerPosition a {
    float: right;
    margin-right: 15px;

  }

  .contentContainer .classifyContainer .title span, .footerPosition a {
    margin-left: 15px;
  }



  .contentContainer .movieContainer .movie {
    width: 44%;
    display: inline-block;
    margin-top: 3%;
    margin-left: 4%;
  }

  .contentContainer .movieContainer .movie img {
    width: 100%;
    height: 112px;

  }

  .contentContainer .movieContainer .movie span, .AdvertisementContainer .Advertisement span {
    color: floralwhite;
    overflow: hidden;
    text-overflow: ellipsis;
    /*-o-text-overflow: ellipsis;*/
    white-space: nowrap;
    width: 100%;
    display: inline-block;

  }

  .AdvertisementContainer .Advertisement {
    height: 50%;
    margin-right: 4%;
    margin-left: 4%;
    margin-bottom: 8%;
  }

  .AdvertisementContainer .Advertisement img {
    width: 100%;
    height: 300px;
    margin-top: 4%;

  }

  .footerPosition {
    padding-bottom: 25%;
  }

  .footerPosition span {
    margin-left: 4%;
  }

  .title a{
    color: #959697;
    text-decoration: none;
  }
</style>
