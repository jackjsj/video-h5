<template>
  <div class="searchContainer">
    <div class="head">
      <div class="menu">
        <span class="iconLeft iconfont  ">&#xe616;</span>
        <input v-model="searchName" type="text" placeholder="输入关键词找查片源">
        <span class="iconRight iconfont " @click="clearData">&#xe613;</span>
      </div>
      <sapn style="color:#C49C69;" @click="back">取消</sapn>
    </div>
    <div v-if="!searchDataList.length">
      <div class="search">
        <span>热门搜索</span>
      </div>
      <div class="popularTitle" @click="search(item)" v-for="(item,index) in hotLabels" :key="index">
        <span>{{item}}</span>
      </div>
    </div>

    <div v-else class="translateContainer">
      <div class="translate" @click="handleSearchSkip(item.id)" v-for="(item,index) in searchDataList" :key="index">
        <div class="translateLeft">
          <img :src="item.cover" alt="">
          <!--<div class="translateSpan">-->
          <!--<span>一起多少话</span>-->
          <!--</div>-->
        </div>
        <div class="translateRight">
          <span>{{item.name}}</span>
        </div>
      </div>


    </div>
  </div>

</template>

<script>

  import {getCaricatureHotLabel, getCartoonInfo} from '../../../api'

  export default {
    data() {
      return {
        hotLabels: [],
        isSearch: false,
        searchName: '', // 搜索名称
        searchDataList: [], //搜索数据
      }
    },
    methods: {
      handleSearchSkip(id) {
        this.$router.push(`/caricatureDetails/${id}`);
      },
      clearData() {
        this.searchDataList = [];
        this.searchName = '';
      },
      back() {
        this.$router.back(-1);
      },
      async search(searchName) {
        
        this.$vux.loading.show({
          text: ''
        });

        if (!searchName) {
          searchName = this.searchName;
        }

        const result = await getCartoonInfo({searchName});

        if (result.retCode === '1') {
          this.searchDataList = result.data.caricatureList;
        } else {
          this.$vux.toast.text(result.retMsg, 'bottom')
        }
        this.$vux.loading.hide();


      },
      async getHotLabel() {
        const result = await getCaricatureHotLabel();
        console.log(result)

        if (result.retCode === '1') {
          this.hotLabels = result.data.searchNameList;
        } else {
          this.$vux.toast.text(result.retMsg, 'bottom')
        }

      }
    },
    mounted() {
      this.getHotLabel();
    }
  }

</script>
<style>

  input[type=text] {
    width: 70%;
    /*margin: 0.8rem  0;*/
    height: 2rem;
    border: 0 solid #f2f2f2;
    background: #EDEDED;
    color: #202124;
    font-size: 1rem;
    line-height: 3rem;
    border-radius: 1.5rem;
    /*background:url("../../img/Icon/all_classify.png");*/
  }

  input[type=text]:focus {
    outline: none;
    /*border-color: #000000;*/
    background-color: #EDEDED;
  }

  input[type=text]::selection {
    background: transparent;
    background-color: #fff;
  }

  input[type=text]::-moz-selection {
    background: transparent;
    background-color: #fff;
  }

  input[type=text]::-webkit-input-placeholder { /* WebKit browsers */
    color: #bababa;
  }

  input[type=text]:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #bababa;
  }

  input[type=text]::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #bababa;
  }

  input[type=text]:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #bababa;
  }

  .menu {
    width: 80%;
    background-color: #EDEDED;
    display: inline-block;
    border-radius: 1.5rem;
    margin: 0.5rem 0;
  }

  .head {
    width: 100%;
    position: fixed;
    top: 0;
    text-align: center;
    margin: 0 auto;
    background-color: white;
  }

  .searchContainer .search {
    margin: 4rem 1rem 1rem 1rem;
  }

  .searchContainer .search span {
    font-size: 1.5rem;
    color: #C49C69;
  }

  .searchContainer .popularTitle {
    margin: 0.8rem 0 0 1rem;
    display: inline-block;
    background-color: #EDEDED;
    padding: 0.7rem;

  }

  .searchContainer .popularTitle span {
    font-size: 0.8rem;

  }


  .translateContainer {
    width: 90%;
    height: 40%;
    margin: 4rem 0 1rem 1rem;
    /*text-align: center;*/
  }

  .translate {
    margin: 1rem auto;
  }

  .translateContainer .translateLeft {
    width: 75%;
    height: 10rem;
    display: inline-block;
  }

  .translateContainer .translateRight {
    display: inline-block;
    width: 20%;
    height: 10rem;
  }

  .translateContainer .translateRight span {
    color: black;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    display: inline-block;
    margin: 0 0.5rem;
    line-height: 10rem;
  }

  .translateContainer .translateLeft img {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
  }

</style>
