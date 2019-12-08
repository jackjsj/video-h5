<template>
  <div class="bg flex-col">
    <!-- 搜索 下载 历史 -->
    <div class="flex aic jcb header flex-none">
      <van-search placeholder="输入关键词搜索片源" v-model="value"
        left-icon=""
        background="transparent"
        class="search-bar"
        shape="round"
        right-icon="search" />
      <img class="header-icon" src="@/assets/images/download.png" />
      <img class="header-icon" src="@/assets/images/history.png" />
    </div>
    <div class="flex-auto ova">
      <!-- 轮播 -->
      <div class="swiper-wrapper">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="item in bannerList"
            :key="item.id"
            @click="onBannerClick(item)">
            <div class="swiper-item flex jcc">
              <van-image fit="contain" :src="item.picUrl" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 分类 -->
      <div class="type-wrapper flex flex-wrap jcb">
        <div
          class="type-item flex-col jcc aic"
          v-for="item in types"
          :key="item.name">
          <van-image class="type-icon" :src="item.icon" />
          <p class="f14 lh20 mt8 wh">{{item.name}}</p>
        </div>
      </div>
      <!-- 最新片源 -->
      <div class="video-list-wrapper wh">
        <!-- 标题 换一换 更多 -->
        <div class="flex jcb video-list-header">
          <p class="f16">最新片源</p>
          <div class="flex aic f14">
            <div class="flex aic mr20">
              <p class="mr5">换一换</p>
              <van-icon name="replay" />
            </div>
            <div class="flex aic">
              <p class="mr5">更多</p>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div class="list flex flex-wrap jcb">
          <div
            class="item mb15"
            v-for="item in newVideoList"
            :key="item.id">
            <div class="img-wrapper rel flex jcc">
              <van-image fit="contain" :src="item.videoCover" />
            </div>
            <p class="cb9 f16 item-name ell">{{item.videoName}}</p>
          </div>
          <div class="item-pad"></div>
        </div>
      </div>
      <!-- 重磅热播 -->
      <div class="video-list-wrapper wh">
        <!-- 标题 换一换 更多 -->
        <div class="flex jcb video-list-header">
          <p class="f16">重磅热播</p>
          <div class="flex aic f14">
            <div class="flex aic mr20">
              <p class="mr5">换一换</p>
              <van-icon name="replay" />
            </div>
            <div class="flex aic">
              <p class="mr5">更多</p>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div class="list flex flex-wrap jcb">
          <div
            class="item mb15"
            v-for="item in mostVideoList"
            :key="item.id">
            <div class="img-wrapper rel flex jcc">
              <van-image fit="contain" :src="item.videoCover" />
            </div>
            <p class="cb9 f16 item-name ell">{{item.videoName}}</p>
          </div>
          <div class="item-pad"></div>
        </div>
      </div>
      <!-- 各类型 -->
      <div class="video-list-wrapper wh"
        v-for="item in classifyListCollect"
        :key="item.id">
        <!-- 标题 换一换 更多 -->
        <div class="flex jcb video-list-header">
          <p class="f16">{{item.name}}</p>
          <div class="flex aic f14">
            <!-- <div class="flex aic mr20">
              <p class="mr5">换一换</p>
              <van-icon name="replay" />
            </div> -->
            <div class="flex aic">
              <p class="mr5">更多</p>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <div class="list flex flex-wrap jcb">
          <div
            class="item mb15"
            v-for="video in item.videoList"
            :key="video.id">
            <div class="img-wrapper rel flex jcc">
              <van-image fit="contain" :src="video.videoCover" />
            </div>
            <p class="cb9 f16 item-name ell">{{video.videoName}}</p>
          </div>
          <div class="item-pad"></div>
        </div>
      </div>
    </div>
    <van-overlay :show="overlayVisible" />
  </div>
</template>

<script>
import { indexInfo } from '@/api/';

const types = [
  {
    name: '动漫',
    icon: require('@/assets/images/动漫.png'),
  },
  {
    name: '科幻',
    icon: require('@/assets/images/科幻.png'),
  },
  {
    name: '恐怖',
    icon: require('@/assets/images/恐怖.png'),
  },
  {
    name: '喜剧',
    icon: require('@/assets/images/喜剧.png'),
  },
  {
    name: '剧情',
    icon: require('@/assets/images/剧情.png'),
  },
  {
    name: '动作',
    icon: require('@/assets/images/动作.png'),
  },
  {
    name: '战争',
    icon: require('@/assets/images/战争.png'),
  },
  {
    name: '全部',
    icon: require('@/assets/images/全部.png'),
  },
];

const list = new Array(9).fill().map((item, index) => ({
  name: '宝可梦',
  cover: '',
  id: index,
}));
export default {
  data() {
    return {
      types,
      newVideoList: [],
      mostVideoList: [],
      classifyListCollect: [],
      bannerList: [],
      overlayVisible: false,
    };
  },
  mounted() {
    this.overlayVisible = true;
    Toast.loading({
      message: '加载中...',
      loadingType: 'spinner',
      duration: 0,
    });
    indexInfo().then(resp => {
      console.log(resp);
      if (resp.httpCode === 200) {
        const { data } = resp;
        this.newVideoList = data.newVideoList;
        this.mostVideoList = data.mostVideoList;
        this.classifyListCollect = data.classifyListCollect;
        this.bannerList = data.bannerList;
        Toast.clear();
        this.overlayVisible = false;
      }
    });
  },
  methods: {
    onBannerClick(item) {
      window.location = item.linkUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  width: 267px;
}
.header-icon {
  width: 21px;
  height: 22px;
}
.header {
  padding: 16px;
}
.van-search {
  padding: 0;
}
.swiper-item {
  width: 345px;
  height: 175px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
.swiper-wrapper {
  padding: 15px;
}
.type-icon {
  width: 45px;
  height: 45px;
}
.type-item {
  width: 25%;
  margin-bottom: 15px;
}
.lh20 {
  line-height: 20px;
}
.mt8 {
  margin-top: 8px;
}
.video-list-wrapper {
  padding: 0 15px;
}
.video-list-header {
  padding: 0 6px 10px 3px;
}
.img-wrapper {
  width: 168px;
  height: 95px;
  background: rgba(204, 204, 204, 0.1);
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.item-pad {
  width: 168px;
}
.item-name {
  background: #161616;
  height: 34px;
  line-height: 34px;
  padding: 0 6px;
  width: 168px;
  box-sizing: border-box;
}
</style>
