<template>
  <div class="bg-2 flex-col vh100 history">
    <div class="flex aic jcb pl15 pr15 flex-none pt10 mb5">
      <van-search ref="searchInput" placeholder="输入关键词搜索片源" v-model="searchName"
        background="transparent"
        class="search-bar flex-auto"
        shape="round"
        left-icon="search"
        @search="onSearch"
        @clear="clearData" />
      <p class="ml8 wh f14 fw400 opa7"
        @click="$router.back()">取消</p>
    </div>
    <div class="ova flex-auto">
      <div class="wh p15" v-if="!searching">
        <!-- 热门搜索 -->
        <div class="mb20">
          <p class="f18 fw500 mb10">热门搜索</p>
          <div class="flex flex-wrap ">
            <p
              class="tag-item mr8 mb8"
              v-for="(item,index) in hotLabels"
              :key="index"
              @click="search(item)">
              {{item}}
            </p>
          </div>
        </div>
        <!-- 热门推荐 -->
        <div>
          <p class="f18 fw500 mb10">热门推荐</p>
          <div class="list flex flex-wrap jcb">
            <div
              class="item mb15"
              v-for="(item,index) in recommands"
              :key="item.id"
              @click="$router.push(`/video/${item.id}`)">
              <div class="img-wrapper rel flex jcc">
                <van-image :src="item.videoCover" />
                <div class="abs cover-logo flex jcc" v-if="item.logoCover">
                  <van-image :src="item.logoCover" />
                </div>
                <p class="abs movie-duration" v-if="item.duration">{{item.duration}}</p>
              </div>
              <p class="cb9 item-name">
                <span class="movie-name">{{item.videoName}}</span></p>
            </div>
            <div class="item-pad"></div>
          </div>
        </div>

      </div>

      <!-- 搜索结果 -->
      <div v-else>
        <!-- <van-list
          v-model="loading"
          :finished="finished"
          :error.sync="error"
          finished-text="没有更多了"
          @load="search"> -->
        <div
          class="flex-col rel result-item"
          v-for="item in searchDataList"
          :key="item.id"
          @click="$router.push(`/video/${item.id}`);">
          <div class="flex-auto cover-img-wrapper flex jcc ovh rel">
            <van-image style="width:100%;height:100%;" :src="item.cover" />
            <div class="abs cover-logo flex jcc" v-if="item.logoCover">
              <van-image :src="item.logoCover" />
            </div>
            <p class="abs movie-duration" v-if="item.duration">{{item.duration}}</p>
          </div>
          <p class="result-name wh flex-none f16 fw600">
            <span class="van-multi-ellipsis--l2 mt5">{{item.name}}</span></p>
        </div>
        <p class="tc mt20 gc f14" v-if="searchDataList.length===0">无搜索结果</p>
        <!-- </van-list> -->
      </div>
    </div>
    <!-- 弹框 -->
    <van-overlay :show="overlayVisible" />
  </div>
</template>

<script>
import { getCaricatureHotLabel, getMovieHotLabel, searchVideo } from '@/api';

export default {
  data() {
    return {
      hotLabels: [],
      searching: false,
      searchName: '', // 搜索名称
      searchDataList: [], // 搜索数据
      overlayVisible: false,
      recommands: [],
      // loading: true,
      // finished: false,
      // error: false,
    };
  },
  mounted() {
    this.$nextTick().then(() => {
      const { type } = this.$route.params;
      this.type = type;
      // document.getElementsByTagName('input')[0].focus();
      this.getHotLabel();
    });
  },
  methods: {
    // 处理搜索点击跳转
    handleSearchSkip(id) {
      this.$router.push(`/video/${id}`);
    },
    clearData() {
      this.searchName = '';
      this.searchDataList = [];
      this.searching = false;
    },
    // 搜索
    onSearch() {
      // this.finished = false;
      // this.error = false;
      // this.loading = false;
      this.search();
    },
    async search(searchName) {
      this.searching = true;
      if (searchName) {
        // this.finished = false;
        // this.error = false;
        // this.loading = false;
        this.searchName = searchName;
      }
      if (this.searchName) {
        // this.overlayVisible = true;
        // Toast.loading({
        //   message: '加载中...',
        //   loadingType: 'spinner',
        //   duration: 0,
        // });
        const result = await searchVideo(this.searchName);
        if (result.retCode === '1') {
          const { current, pages, data } = result;
          this.searchDataList = data.map(i => ({
            name: i.videoName,
            cover: i.videoCover,
            id: i.id,
          }));
          // this.loading = false;
          // if (current === pages || pages === 0) {
          //   // 最后一页了
          //   this.finished = true;
          // } else {
          //   this.pageNum++;
          // }
          // if (current === 1) {
          //   this.searchDataList = data.map(i => ({
          //     name: i.videoName,
          //     cover: i.videoCover,
          //     id: i.id,
          //   }));
          // } else {
          //   this.movieList.push(
          //     ...data.map(i => ({
          //       name: i.videoName,
          //       cover: i.videoCover,
          //       id: i.id,
          //     })),
          //   );
          // }
        } else {
          Toast(result.retMsg);
          // this.error = true;
        }
        // this.overlayVisible = false;
      } else {
        Toast('请输入搜索内容');
      }
    },
    // 获取热词
    async getHotLabel() {
      // Toast.loading({
      //   message: '加载中...',
      //   loadingType: 'spinner',
      //   duration: 0,
      //   forbidClick: true,
      //   overlay: true,
      // });
      const result = await getMovieHotLabel();
      if (result.retCode === '1') {
        const {
          data: { popularSearches, randVideoList },
        } = result;
        this.hotLabels = popularSearches.map(item => item.searchName);
        this.recommands = randVideoList;
        // Toast.clear();
      } else {
        Toast(result.retMsg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.van-search {
  padding: 0;
}
.tag-item {
  background: rgba(0, 0, 0, 0.2);
  line-height: 1;
  padding: 6px 8px;
  border-radius: 4px;
}
.result-item {
  margin: 15px;
  height: 239px;
  box-sizing: border-box;
}
.cover-img-wrapper {
  border-radius: 9px 9px 0 0;
  background: rgba(255, 255, 255, 0.1);
}
.result-name {
  border-radius: 0 0 9px 9px;
  height: 45px;
  line-height: 18px;
  padding: 0 13px;
  background: rgba(27, 24, 46, 1);
}
.list {
  .item {
    border-radius: 4px;
    overflow: hidden;
  }
}
.item-pad {
  width: 168px;
}
.img-wrapper {
  width: 168px;
  height: 95px;
  background: rgba(204, 204, 204, 0.1);
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.item-name {
  background: #161616;
  height: 34px;
  line-height: 34px;
  padding: 0 6px;
  width: 168px;
  border-radius: 0 0 12px 12px;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.van-icon-search {
  color: #fff;
  opacity: 0.7;
}
</style>
