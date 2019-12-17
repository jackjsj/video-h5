<template>
  <div class="bg-2 flex-col vh100">
    <van-nav-bar
      class="flex-none"
      :title="caricatureInfo.name"
      left-arrow
      @click-left="$router.back()"
      :border="false">
    </van-nav-bar>
    <div class="flex-auto ova wh p15 mt5">
      <div class="flex jcc cover mb15 ovh">
        <van-image :src="caricatureInfo.cover"></van-image>
      </div>
      <p class="ell f17 fw600 mb10">{{caricatureInfo.caricatureDesc}}</p>
      <div class="flex opa7 f12">
        <div class="flex aic pr10 mr10"
          style="border-right:1px solid rgba(255,255,255,.7)">
          <van-icon name="orders-o" />
          <p class="ml5">共 {{caricatureInfo.chapterNum}} 话</p>
        </div>
        <div class="flex aic">
          <van-icon name="play-circle" />
          <p class="ml5">观看 {{caricatureInfo.watchNum}} 次</p>
        </div>
      </div>
      <!-- 广告 -->
      <div class="mt15">
        <div>
          <van-swipe
            :autoplay="3000"
            :show-indicators="false"
            indicator-color="#FF7AC8">
            <van-swipe-item v-for="(item,index) in bannerList"
              :key="item.id"
              @click="onSwiperClick(index)">
              <div class="swiper-item flex jcc ovh">
                <van-image :src="item.picUrl"></van-image>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
    <!-- 加入书架 全部章节 立即阅读 -->
    <div class="flex-none flex aic btn-group wh f14 fw400">
      <div class="flex1 tc btn-group-item"
        @click="handleCaricatureCollect"
        style="border-right:1px solid rgba(255, 255, 255, 0.2);">{{isCollect === '1'?'已':''}}加入书架</div>
      <div class="flex1 tc btn-group-item"
        @click="toChapterNumPage">全部章节</div>
      <div class="flex1 tc btn-group-item"
        @click="toReadPage">立即阅读</div>
    </div>
  </div>
</template>

<script>
import {
  getCaricatureInfo,
  addCaricatureCollect,
  delCaricatureCollect,
} from '@/api';

export default {
  data() {
    return {
      caricatureId: null,
      caricatureInfo: {},
      bannerList: [],
      isCollect: '0', // 是否收藏
    };
  },
  mounted() {
    const { caricatureId } = this.$route.params;
    this.caricatureId = caricatureId;
    this.getCaricatureInfo();
  },
  methods: {
    // 全部章节
    toChapterNumPage() {
      this.$router.push(`/caricatureChapterNum/${this.caricatureId}`);
    },
    // 立即阅读
    toReadPage() {
      this.$router.push(
        `/caricaturePictureList/${this.caricatureInfo.chapterId}`,
      );
    },

    // 跳转
    onSwiperClick(index) {
      // 获取当前广告类型
      debugger;
      const banner = this.bannerList[index];
      /**
       *  判断是否已经完成当前任务
       */
      const { linkType } = banner; // 广告类型
      switch (linkType) {
        case 1:
          // 外部链接
          window.location.href = banner.linkUrl;
          break;
        case 3:
          // 购买vip
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
    // 加入书架
    async handleCaricatureCollect() {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const { isCollect } = this;
      let result = null;
      if (isCollect === '1') {
        // 取消收藏
        result = await delCaricatureCollect(this.caricatureId);
      } else {
        // 收藏
        result = await addCaricatureCollect(this.caricatureId);
      }
      if (result.retCode === '1') {
        // 修改收藏状态
        this.isCollect = isCollect === '1' ? '0' : '1';
      }
      Toast(result.retMsg);
    },
    async getCaricatureInfo() {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const result = await getCaricatureInfo(this.caricatureId);
      if (result.retCode === '1') {
        this.caricatureInfo = result.data.caricatureMap;
        this.isCollect = result.data.isCollect;
        this.bannerList = result.data.bannerListHead;
        Toast.clear();
      } else {
        Toast(result.retMsg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cover {
  height: 194px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}
.swiper-item {
  margin: 0 10px;
  // width: 289px;
  height: 84px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  // margin: auto;
}
.btn-group {
  height: 50px;
  background: rgba(27, 24, 46, 1);
}
.btn-group-item {
  height: 29px;
  line-height: 29px;
  &:active {
    opacity: 0.7;
  }
  &:last-child {
    height: 50px;
    line-height: 50px;
    background: linear-gradient(#e95aa0, #a769ff);
  }
}
</style>
