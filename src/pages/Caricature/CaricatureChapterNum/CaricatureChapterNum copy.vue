<template>
  <div>
    <x-header title="章节"/>
    <scroller lock-x>
    <div class= "chapter">

        <div class="first" v-for="(item,index) in chapterList" @click="toCaricaturePicturePage(item.id)" :key="index">{{item.name}}</div>

    </div>
    </scroller>
  </div>
</template>

<script>

  import {XHeader,Scroller} from 'vux'

  import {getCaricatureChapterInfo} from '../../../api'

    export default {
      components: {
        XHeader,
        Scroller
      },
      data(){
        return {
          id: null,
          chapterList: []
        }
      },
      mounted(){
        // 获取参数
        const {id} = this.$route.params;
        this.id = id;

        this.getCaricatureChapterInfo();
      },
      methods: {
        // 跳转漫画详情页面
        toCaricaturePicturePage(id){
          this.$router.push(`/caricaturePictureList/${id}`)
        },
        async getCaricatureChapterInfo(){

          this.$vux.loading.show({
            text: ''
          });
          const result = await getCaricatureChapterInfo(this.id);
          console.log(result)
          if(result.retCode === '1'){
            console.log(result)
            this.chapterList = result.data.chapterMapList;

          }else{
            this.$vux.toast.text(result.retMsg, 'bottom');
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
  .header{
    width: 98%;
    line-height: 2.5rem;
    margin: 0 auto;
    border: .1rem solid;
  }
  .header >.back{
    float: left;
  }
  .header > .tap{
    text-align: center;
  }
  .chapter{
    line-height: 3rem;
    margin:1rem auto;
  }
  .chapter .first{

    width: 94%;
    height: 2rem;
    line-height: 2rem;
    margin: 1rem auto;
    border: .2rem solid;
    border-radius: .6rem;
    padding-left: .1rem;
    color:yellowgreen
  }
</style>
