<template>
  <div class="bg flex-col">
    <!-- 搜索 下载 历史 -->
    <div class="flex aic jcb header flex-none">
      <van-search placeholder="输入关键词搜索片源"
        left-icon=""
        background="transparent"
        class="search-bar"
        shape="round"
        right-icon="search"
        @focus="$router.push('/movieSearch')" />
      <img class="header-icon" src="@/assets/images/download.png"
        @click="$router.push('offlineCache')" />
      <img class="header-icon" src="@/assets/images/history.png"
        @click="$router.push('/viewHistory')" />
    </div>
    <div class="flex-auto ova">
      <!-- 轮播 -->
      <div class="swiper-wrapper">
        <van-swipe :autoplay="3000" indicator-color="white"
          :stop-propagation="false">
          <van-swipe-item v-for="(item,index) in bannerList"
            :key="item.id"
            @click="handleRotationChart(index)">
            <div class="swiper-item flex jcc ovh">
              <van-image :src="item.picUrl" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 分类 -->
      <div class="type-wrapper flex flex-wrap jcb">
        <div
          class="type-item flex-col jcc aic"
          v-for="item in types"
          :key="item.name"
          @click="$router.push(`/movieClassifyList?type=${item.name}`)">
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
            <!-- <div class="flex aic mr20">
              <p class="mr5">换一换</p>
              <van-icon name="replay" />
            </div> -->
            <div class="flex aic"
              @click="$router.push('/movieClassifyList?order=最近更新')">
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
            :key="item.id"
            @click="$router.push(`/video/${item.id}`)">
            <div class="img-wrapper rel flex jcc">
              <van-image :src="item.videoCover" />
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
            <!-- <div class="flex aic mr20">
              <p class="mr5">换一换</p>
              <van-icon name="replay" />
            </div> -->
            <div class="flex aic"
              @click="$router.push('/movieClassifyList?order=最多播放')">
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
            :key="item.id"
            @click="$router.push(`/video/${item.id}`);">
            <div class="img-wrapper rel flex jcc">
              <van-image :src="item.videoCover" />
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
        <div v-if="item.name !=='全部'">
          <!-- 标题 换一换 更多 -->
          <div class="flex jcb video-list-header">
            <p class="f16">{{item.name}}</p>
            <div class="flex aic f14">
              <!-- <div class="flex aic mr20">
              <p class="mr5">换一换</p>
              <van-icon name="replay" />
            </div> -->
              <div class="flex aic"
                @click="$router.push(`/movieClassifyList?type=${item.name}`)">
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
              :key="video.id"
              @click="$router.push(`/video/${video.id}`);">
              <div class="img-wrapper rel flex jcc">
                <van-image :src="video.videoCover" />
              </div>
              <p class="cb9 f16 item-name ell">{{video.videoName}}</p>
            </div>
            <div class="item-pad"></div>
          </div>
        </div>
      </div>
    </div>
    <van-overlay :show="overlayVisible" />
    <van-popup
      :close-on-click-overlay="false"
      class="popup rel " v-model="popupVisible">
      <div class="animated bounceIn fast">
        <img src="@/assets/images/home-popup.png" />
        <!-- 关闭按钮 -->
        <div class="popup-close-btn"
          @click="popupVisible=false"></div>
        <!-- 说明 -->
        <div class="wh popup-content tc flex-col aic">
          <p class="lh33 f24 f600 mb10">{{notice.noticleTitle}}</p>
          <p class="lh24 f14 fw400" v-html="notice.noticContent && notice.noticContent.replace(/\n/g,'<br>')"></p>
          <div class="popup-confirm-btn f14 tc fw400"
            @click="popupVisible=false">
            <span>我知道了</span>
          </div>
        </div>
      </div>

    </van-popup>
  </div>

</template>

<script>
import { getIndexInfo, checkInAddIntegral, getExtensionUrl } from '@/api/';
const types = [
  {
    name: '动漫',
    icon: require('@/assets/images/动漫.png'),
    id: 8,
  },
  {
    name: '科幻',
    icon: require('@/assets/images/科幻.png'),
    id: 7,
  },
  {
    name: '恐怖',
    icon: require('@/assets/images/恐怖.png'),
    id: 6,
  },
  {
    name: '喜剧',
    icon: require('@/assets/images/喜剧.png'),
    id: 5,
  },
  {
    name: '剧情',
    icon: require('@/assets/images/剧情.png'),
    id: 4,
  },
  {
    name: '动作',
    icon: require('@/assets/images/动作.png'),
    id: 3,
  },
  {
    name: '战争',
    icon: require('@/assets/images/战争.png'),
    id: 2,
  },
  {
    name: '全部',
    icon: require('@/assets/images/全部.png'),
    id: -1,
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
      value: '',
      indexInfoData: null, // 首页数据
      bannerList: [], //轮播图
      classifyList: [], //分类数据
      newVideoList: [], //最新电影
      mostVideoList: [], // 重磅热播
      classifyListCollect: [],
      extensionUrl: 'http://baidu.com', //推广url

      //
      popupVisible: false,
      notice: {},
    };
  },
  mounted() {
    // 显示通知列表
    this.getIndexInfo();
    // this.getExtensionUrl();
  },
  methods: {
    /**
     * 跳转app推广页面
     */
    toAppDownPage() {
      window.location.href = this.extensionUrl;
    },
    toSearchPage() {
      this.$router.push('/movieSearch');
    },
    // 处理轮播图
    handleRotationChart(index) {
      // 获取当前广告类型
      const banner = this.bannerList[index];
      /**
       *  判断是否已经完成当前任务
       */
      this.addIntegral(3);
      const linkType = banner.linkType; //广告类型
      console.log(linkType);
      switch (linkType) {
        case 1:
          // 外部链接
          window.location.href = banner.linkUrl;
          break;
        case 3:
          //购买vip
          this.$router.push('/vipInfoDetails/1');
          break;
        case 4:
          // 邀请好友
          this.$router.push('/invitation');
          break;
        default:
          // 默认跳转首页
          this.$router.push('/home');
      }
    },
    /**
     * 获取推广url
     */
    async getExtensionUrl() {
      const result = await getExtensionUrl();
      if (result.httpCode === 200) {
        this.extensionUrl = result.extensionUrl;
      }
    },
    /**
     * 获取首页数据
     */
    async getIndexInfo() {
      this.overlayVisible = true;
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const result = await getIndexInfo();
      if (result.retCode === '1') {
        const { data } = result;
        this.newVideoList = data.newVideoList;
        this.mostVideoList = data.mostVideoList;
        this.classifyListCollect = data.classifyListCollect;
        this.bannerList = data.bannerList;
        Toast.clear();
        this.overlayVisible = false;
        const notice = JSON.parse(localStorage.getItem('notice'));
        if (notice && !this.$store.state.noticeShowed) {
          this.notice = notice;
          this.popupVisible = true;
          this.$store.state.noticeShowed = true;
        }
      } else {
        Toast.clear();
        this.overlayVisible = false;
        Toast(result.retMsg);
      }
    },
    async addIntegral() {
      const id = 3;
      const result = await checkInAddIntegral(id);
      if (result.retCode === '1') {
        Toast('任务完成');
      } else {
        Toast('任务失败:' + result.retMsg);
      }
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
.popup {
  box-sizing: border-box;
  width: 375px;
  padding: 0 25px;
  background: transparent;
  img {
    width: 100%;
  }
}
.popup-close-btn {
  position: absolute;
  top: 6px;
  right: 45px;
  width: 21px;
  height: 21px;
  background: transparent;
}
.popup-content {
  position: absolute;
  left: 50%;
  margin-left: -70px;
  top: 115px;
  width: 197px;
}
.popup-confirm-btn {
  width: 160px;
  height: 80px;
  line-height: 78px;
  background: url(~@/assets/images/button.png);
  background-size: contain;
  &:active {
    opacity: 0.7;
  }
}
</style>
