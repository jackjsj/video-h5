<template>
  <div  class="MovieContainer">
    <div class="header">
      <x-header style="background-color: #323232;" class="head" :left-options="{backText: ''}">
        <span>{{classifyName}}  </span>
        <a slot="right"><span class="icon iconfont" style="font-size: 1.8rem">&#xe65a;</span></a>
      </x-header>
      <div class="headerBottom">
        <tab>
          <tab-item :selected="index === orderIndex" v-for="(item,index) in orderList" :key="index" @on-item-click="getMovieList(index,null)">{{item.name}}</tab-item>
        </tab>

        <tab>
          <tab-item :selected="index === classifyIndex" v-for="(item,index) in classifyList" :key="index" @on-item-click="getMovieList(null,item.id,index)">{{item.name}}</tab-item>
        </tab>
      </div>

    </div>

    <scroller  lock-x scrollbar-y ref="scroller"  @on-scroll-bottom="pageQuery" :scroll-bottom-offst="200"  >
      <flexbox class="filmContainer" :gutter="0" wrap="wrap">
        <flexbox-item v-for="(item,index) in movieList" :key="index" :span="1/2">
          <div class="film">
            <a href="javaScript:">
              <img @click="$router.push(`/video/${item.id}`)" :src="item.videoCover" alt="">
              <span>{{item.videoName}}</span>
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

  import {getMovieList} from '../../api'


  export default {
    components: {
      Scroller,
      Tab,
      TabItem,
      Flexbox,
      FlexboxItem,
      XHeader
    },
    computed: {
      classifyName(){
        // return (this.classifyIndex != null && !this.isInit) ? this.classifyList[this.classifyIndex].name: '分类'
        return '分类'
      }
    },
    data() {
      return {
        onFetching: false, //分页查询上锁
        dataOnNull: false,
        pageParams: {
          pageNum: 1, // 当前页
          classifyId: null, //分类id
          orderStr: '', //排序字段
        },
        orderList: [],
        orderIndex: 0,
        movieList: [], //电影数据
        classifyList: [], //分类数据
        classifyIndex: null,
        isInit: true // 是否为初始化
      }
    },
    mounted(){

      // 初始化顶部排序字段
      this.orderList = [{name: '最多播放', type: 1}, {name: '最近更新', type: 2}, {name: '最多喜欢', type: 3}];

      // 获取路由中的参数
      const {classifyId,classifyIndex,orderType} = this.$route.params;

      if(classifyId !== '-1'){
        this.pageParams.classifyId = classifyId;
      }

      this.orderIndex = parseInt(orderType);

      if(classifyIndex !== '-1'){
        this.classifyIndex = parseInt(classifyIndex);
      }
      // 查询数据
      this.getMovieList();
    },
    methods: {
      // 分页查询
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
          let params = this.getReqParams(null,null);

          //添加分页数
          params.pageNum = this.pageParams.pageNum + 1;

          const result = await getMovieList(params);

          if (result.retCode === '1') {
            let movieList = result.data;

            if(movieList.length <= 0){ //标识无数据
              this.dataOnNull = true;
            }


            this.movieList = this.movieList.concat(movieList);
            this.onFetching = false;

            this.pageParams.pageNum = this.pageParams.pageNum + 1;

            this.$vux.loading.hide();

            this.$nextTick(() => {
              this.$refs.contentScroller.reset()
            });
          }
        }
      },
      // 查询数据,不分页
      async getMovieList(oderIndex,classifyId,classifyIndex){

        if(classifyIndex != null){
          this.classifyIndex = classifyIndex;
        }
        this.$vux.loading.show({
          text: ''
        });
        // 重置分页参数
        this.dataOnNull = false;
        this.onFetching = false;
        this.pageParams.pageNum = 1;

        const params = this.getReqParams(oderIndex,classifyId);

        const result = await getMovieList(params);

        if(result.retCode === '1'){
          this.movieList = result.data;
          this.classifyList = result.classifyList;

          this.$refs.scroller.reset({top: 0});

          this.$vux.loading.hide()
        }else{
          this.$vux.toast.text(result.retMsg, 'bottom')
        }
      },
      getReqParams(orderIndex,classifyId){

        let params = {};

        // 防止为空
        if (this.isInit || orderIndex == null) {
          orderIndex = this.orderIndex;
          this.isInit = false;
        }


        if (classifyId == null) {
          classifyId = this.pageParams.classifyId;
        }

        const orderType = this.orderList[orderIndex].type;


        if(classifyId){
          params.classifyId = classifyId;
        }


        if (orderType) {

          switch (orderType) {
            case 1: {
              params.mostPlay = '1';
              this.pageParams.orderStr = 'mostPlay';
              break;
            }
            case 2: {
              params.newVideo = '1';
              this.pageParams.orderStr = 'newVideo';
              break;
            }
            case 3: {
              params.mostCare = '1';
              this.pageParams.orderStr = 'mostCare';
              break;
            }
          }

        }

        params.pageNum = this.pageParams.pageNum;
        this.pageParams.classifyId = classifyId;

        // 保存搜索标识
        this.orderIndex = orderIndex;

        return params;
      }


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



  .MovieContainer  .filmContainer .film{
    width: 100%;
    height: 100%;
    /*float: left;*/

  }
  .MovieContainer  .filmContainer .film img{
    width: 90%;
    height: 10rem;
    margin: 1rem 0.5rem 0 0.5rem;
  }
  .MovieContainer  .filmContainer .film span{
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
    margin-top: 6rem ;
    background-color: #FFFFFF;
  }


</style>
