<template>
  <div  class="MovieContainer">
    <div class="header">
      <x-header style="background-color: #323232;" class="head" :left-options="{backText: ''}">
        <span style="color: #DBB97C;">{{tagName}} </span>
      </x-header>
    </div>

    <scroller  lock-x scrollbar-y ref="scroller"  @on-scroll-bottom="pageQuery" :scroll-bottom-offst="200" >
      <flexbox class="MovieContainerFilmContainer" :gutter="0" wrap="wrap">
        <flexbox-item  v-for="(item,index) in movieList" :key="index" :span="1/2">
          <div class="film">
            <a href="javascript:void(0)" @click="toVideoPage(item.id)">
              <img :src="item.videoCover" alt="">
              <span>{{item.briefContent}}</span>
            </a>
          </div>

        </flexbox-item>
        <div class="blank">

        </div>
      </flexbox>

    </scroller>



  </div>
</template>

<script>
  import {Scroller,Tab,TabItem,Flexbox,FlexboxItem,XHeader} from 'vux'
  import {Base64} from 'js-base64'
  import {getMovieList} from '../../api'

  export default {
    name: "Bannel",
    components: {
      Scroller,
      Tab,
      TabItem,
      Flexbox,
      FlexboxItem,
      XHeader
    },
    data(){
      return {
        onFetching: false, //分页查询上锁
        dataOnNull: false,
        pageNum: 1,
        movieList: [], //电影数据
        tagId: null,
        tagName: ''
      }

    },
    methods: {
      toVideoPage(id){
        console.log('~~~~~~~~~~')
        this.$router.push(`/video/${id}`);
      },
      async pageQuery(){
        if (this.onFetching) {
        } else {

          this.$vux.loading.show({
            text: ''
          });

          this.onFetching = true;
          if(this.dataOnNull){
            this.$vux.toast.text('没有更多数据', 'bottom');
            return ;
          }
          // 查询数据
          let params = {
            pageNum: this.pageNum,
            tagIds: this.tagId
          };



          const result = await getMovieList(params);

          if (result.retCode === '1') {
            let movieList = result.data;

            if(movieList.length <= 0){ //标识无数据
              this.dataOnNull = true;
            }


            this.movieList = this.movieList.concat(movieList);
            this.onFetching = false;

            this.pageNum = this.pageNum + 1;


            this.$vux.loading.hide();

            this.$nextTick(() => {
              this.$refs.contentScroller.reset()
            });
          }
        }
      }
    },
    mounted() {
      // 获取参数
      const {tagId,tagName} = this.$route.params;
      this.tagId = tagId;
      this.tagName = Base64.decode(tagName);

      // 初始化数据
      this.pageQuery();
    }
  }

</script>

<style scoped>
  body{
    width: 100%;
    height: 100%;
    /*background-color: #FFFFFF;*/
  }
  .MovieContainer{
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
  }
  .header{
    background: #323232;
  }
  .header .headerTop{
    width: 100%;
    height: 3.3rem;
    text-align: center;
  }
  .header .headerTop span{
    line-height:3.3rem;
  }



  .MovieContainer  .MovieContainerFilmContainer .film{
    width: 100%;
    height: 100%;
    /*float: left;*/

  }
  .MovieContainer  .MovieContainerFilmContainer .film img{
    width: 90%;
    height: 10rem;
    margin: 1rem 0.5rem 0 0.5rem;
  }
  .MovieContainer  .MovieContainerFilmContainer .film span{
    color: black;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    display: inline-block;
    margin: 0 0.5rem;
  }
  .MovieContainer  .blank {
    width: 100%;
    height: 5rem;
    background-color: #FFFFFF;
  }


</style>
