<template>
  <div class="page">
    <x-header class="top" title="章节"/>
    <div class="picture">
      <div class="img" v-for="(item,index) in chapterPictureList" >
        <img :src="item.imgUrl"/>
      </div>

    </div>
    <div class="bottom">
      <ul>
        <li><a href="javascript:void(0)" @click="getChapterPictureList(upId)">上一章</a></li>
        <li><a href="javascript:void(0)"  @click="getChapterPictureList(nextId)">下一章</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {XHeader} from 'vux'
  import {getChapterPictureList} from '../../../api'

  export default {
    name: "CaricaturePictureList",
    components: {
      XHeader
    },
    data() {
      return {
        chapterId: null, //章节id
        chapterPictureList: [], // 图片列表
        upId: null, //上一章
        nextId: null //下一章
      }
    },
    mounted() {
      const {chapterId} = this.$route.params;
      this.chapterId = chapterId;
      this.getChapterPictureList(this.chapterId);

    },
    methods: {
      async getChapterPictureList(chapterId) {

        // 如果章节id为-1则表示无上一章
        if(chapterId === -1){
          this.$vux.toast.text('无更多数据', 'bottom');
          return ;
        }



        this.$vux.loading.show({
          text: ''
        });

        const result = await getChapterPictureList(chapterId);

        if (result.retCode === '1') {
          this.chapterPictureList = result.data.caricatureChapterMap.chapterImgList;
          this.upId = result.data.caricatureChapterMap.upId;
          this.nextId = result.data.caricatureChapterMap.nextId;

          document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
          this.$vux.toast.text(result.retMsg, 'bottom')
        }

        this.$vux.loading.hide();

      }
    }
  }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }

  .top{
    position: fixed;
    top: 0rem;
    width: 100%;
    line-height: 2rem;
    border:.1rem solid #E1E1E1;
  }
  .back{
    float: left;
  }
  .top>.tap{
    text-align: center;

  }
  .bottom{
    position: fixed;
    bottom: 0.1rem;
    width: 98%;
    height: 4%;

  }
  .bottom ul{
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    background-color: black;
  }
  .bottom >ul  a{
    text-decoration: none;
    color: #CC9966;
  }
  .bottom ul>li{
    width: 49%;
    height: 100%;
    text-align: center;
    line-height: 1.8rem;
    list-style: none;
    float:left;
  }
  .picture{
    margin: 0rem auto;
    width: 100%;
  }
  .picture >.img{
    width: 100%;
  }
  .picture >.img img{
    margin: -0.15rem auto;
    width: 100%;
    background-repeat:no-repeat ;
    background-attachment: fixed;
  }

  .bottom ul>li:not(:last-child){
    border-right: .1rem solid #E1E1E1;
  }
</style>
