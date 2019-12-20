<template>
  <div class="bg flex-col vh100 video">
    <van-nav-bar
      class="flex-none"
      left-arrow
      @click-left="$router.back()"
      :border="false">
    </van-nav-bar>
    <!-- 视频 -->
    <div class="video-wrapper flex-none">
      <video-player id="broadcast" class="vjs-custom-skin" style="width: 100%; height:100%;"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        @timeupdate="onPlayerTimeupdate($event)">
      </video-player>
    </div>
    <div class="flex-auto ova bg-2">
      <!-- 信息 -->
      <div class="wh video-info">
        <p class="f18 fw500 mb10">{{videoDetails.videoName}}</p>
        <!-- 热度 时间 -->
        <div class="flex aic f14 fw400 mb20">
          <div class="flex aic mr18">
            <van-icon name="fire" color="#9348FF" />
            <p class="ml5 opa7">热度{{videoDetails.playNum}}</p>
          </div>
          <div class="flex aic opa7">
            <van-icon name="clock-o" />
            <p class="ml5">{{videoDetails.pushTime}}</p>
          </div>
        </div>
        <!-- 点赞 收藏 缓存 分享 -->
        <div class="flex aic jca">
          <div class="flex-col aic"
            @click="upPraise">
            <div class="op-icon">
              <van-icon name="good-job-o" :color="videoDetails.isLike !== '0'?'#FC386F':'#fff'" />
            </div>
            <div class="opa3">{{videoDetails.careNum}}</div>
          </div>
          <div class="flex-col aic"
            @click="collection">
            <div class="op-icon">
              <van-icon name="star-o" :color="videoDetails.isCare !=='0' ?'#FC386F':'#fff'" />
            </div>
            <div class="opa3">收藏</div>
          </div>
          <div class="flex-col aic">
            <div class="op-icon">
              <img src="@/assets/images/cache.png" />
            </div>
            <div class="opa3">缓存</div>
          </div>
          <div class="flex-col aic"
            @click="share">
            <div class="op-icon">
              <img src="@/assets/images/share.png" />
            </div>
            <div class="opa3">分享</div>
          </div>
        </div>
      </div>
      <!-- 广告 -->
      <div class="mt20">
        <!-- <div>
          <van-swipe
            :autoplay="3000"
            :show-indicators="false"
            indicator-color="#FF7AC8">
            <van-swipe-item v-for="(item) in bannerList"
              :key="item.id"
              @click="onSwiperClick(item)">
              <div class="swiper-item flex jcc">
                <van-image fit="cover" :src="item.picUrl"></van-image>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div> -->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide"
              v-for="(item) in bannerList"
              :key="item.id"
              @click="onSwiperClick(item)">
              <div class="swiper-item flex jcc ovh">
                <van-image :src="item.picUrl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- tabs -->
      <div class="p15">
        <van-tabs
          :border="false"
          title-active-color="#fff"
          title-inactive-color="#A7ADB6">
          <van-tab title="简介">
            <div class="wh">
              <p class="f13 opa7 lh21"
                :class="{'van-multi-ellipsis--l2':!showMore}">
                {{videoDetails.briefContent}}
              </p>
              <div class="flex aic opa5 mb15"
                style="justify-content:flex-end;"
                @click="showMore = !showMore">
                <span>{{showMore?'收起':'更多'}}</span>
                <van-icon :name="showMore?'arrow-up':'arrow-down'" />
              </div>
              <!-- 影片类型、标签、番号 -->
              <div class="lh16 mb15">
                <div class="flex mb5">
                  <span class="opa5 flex-none">影片类型：</span>
                  <div class="flex flex-wrap" v-if="videoDetails.classifyName">
                    <p
                      style="border-width:1px;"
                      v-for="type in videoDetails.classifyName.split(',')"
                      :key="type"
                      class="tag flex-none mr5 mb5 mc-purple">{{type}}</p>
                  </div>
                </div>
                <div class="flex mb5">
                  <span class="opa5 flex-none">影片标签：</span>
                  <div class="flex flex-wrap" v-if="videoDetails.tags">
                    <p
                      style="border-width:1px;"
                      v-for="(item) in videoDetails.tags.split(',')"
                      :key="item"
                      class="tag flex-none mr5 mb5 mc-purple">{{item}}</p>
                  </div>
                </div>
                <div class="flex aic mb5">
                  <span class="opa5 flex-none">影片番号：</span>
                  <span class="opa5">{{videoDetails.id}}</span>
                </div>
              </div>
              <!-- 猜你喜欢 -->
              <div class="wh">
                <p class="mb18 f16 fw500">猜你喜欢</p>
                <!-- 列表 -->
                <div>
                  <div
                    class="guess-item flex"
                    v-for="item in videoDetails.likeVideoList"
                    :key="item.id"
                    @click="$router.push(`/video/${item.id}`);">
                    <div class="flex jcc flex-none mr12 guess-item-cover ovh rel">
                      <van-image :src="item.videoCover" />
                      <div class="abs cover-logo flex jcc" v-if="item.logoCover">
                        <van-image :src="item.logoCover" />
                      </div>
                      <p class="abs movie-duration" v-if="item.duration">{{item.duration}}</p>
                    </div>
                    <div class="flex-auto ovh">
                      <p class="opa9 f16 fw500 mb5 ell">{{item.videoName}}</p>
                      <div class="flex flex-wrap mb5 pct100 tag-box" v-if="item.tagsName">
                        <p
                          style="border-width:1px;"
                          v-for="tag in item.tagsName.split(',')"
                          :key="tag"
                          class="tag flex-none mr5 mb5">{{tag}}</p>
                      </div>
                      <div class="flex jcb opa5">
                        <div class="flex aic">
                          <van-icon name="play-circle" />
                          <span class="ml5">播放{{item.playNum}}次</span>
                        </div>
                        <div class="flex aic">
                          <van-icon name="clock-o" />
                          <span class="ml5">{{item.pushTime}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="评论(0)">
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <!-- 评论 -->
    <div class="flex-none comment-box flex aic wh">
      <div class="flex jcc avatar ovh mr12">
        <van-image fit="cover" :src="memberInfo.headpic ? memberInfo.headpic : defaultAvatar" />
      </div>
      <p class="f14 fw400">快来说说你的感想吧</p>
    </div>
  </div>
</template>

<script>
import 'swiper/css/swiper.min.css';
import Swiper from 'swiper';
import { videoPlayer, setCareTimes } from 'vue-video-player';
import { getVideoDetail, setCareHistory, setCareTimess } from '@/api';
import './css/custom-theme.css';

export default {
  components: {
    videoPlayer,
  },
  data() {
    return {
      banner: {},
      payDuration: 60,
      isVip: 1,
      isShowMoreMovie: false, // 是否显示更多电影
      isAlreadyCollection: false, // 是否已经点过喜欢
      isAlreadyPraise: false, // 是否已经点过赞
      showToastMsg: '',
      showToast: false,
      videoId: '',
      isUpPraise: false, // 是否点赞
      isDownPraise: false, // 是否点差评点赞
      show: false,
      // videojs options
      playerOptions: {
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: true, // 默认情况下将会消除任何音频。
        language: 'zh-CN',
        controls: true, // 控制条
        preload: 'auto', // 视频预加载
        loop: false, // 导致视频一结束就重新开始。 //播放速度
        /* playbackRates: [0.7, 1.0, 1.5, 2.0], */ aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            /* type: "video/mp4", */
            type: 'application/x-mpegURL',
            /* src: "http://vjs.zencdn.net/v/oceans.mp4", */
            /* http://v1.727831.com/20190914/YR0JZ3Lp/index.m3u8 */
            src: '',
          },
        ],
        poster: '', // 未播放时封面图片
        width: document.documentElement.clientWidth,
        notSupportedMessage: '加载中，请耐心等待或者重新点击影片', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      videoDetails: {
        classifyName: '',
        tags: '',
      },
      isPermitView: false, // 是否允许用户观看
      isPermitComment: false, // 是否允许用户评论

      //
      bannerList: [],
      showMore: false,
      defaultAvatar: require('@/assets/images/avatar.png'),
      memberInfo: {},
    };
  },
  mounted() {
    this.videoId = this.$route.params.videoId;
    this.getVideoDetail(this.videoId);
    this.memberInfo = JSON.parse(localStorage.getItem('memberInfo')) || {};
    console.log(1);
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {
    // 处理广告跳转
    onSwiperClick(item) {
      switch (item.linkType) {
        case 1: {
          // 外部链接
          window.location.href = item.linkUrl;
          break;
        }
        case 3: {
          // 购买vip
          this.$router.push('/vipInfoDetails/1');
          break;
        }
        case 4: {
          // 邀请好友
          this.$router.push('/invitation');
          break;
        }
        default: {
          // 默认跳转首页
          this.$router.push('/home');
        }
      }
    },
    // 发送请求获取影片数据
    async getVideoDetail(videoId) {
      console.log(videoId);
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
      });
      const result = await getVideoDetail({
        videoId,
      });
      if (result.retCode === '1') {
        this.playerOptions.sources[0].src = result.data.videoUrl;
        this.playerOptions.sources[0].type = 'application/x-mpegURL';
        this.videoDetails = result.data;
        this.isVip = result.isVip;
        this.payDuration = result.payDuration;
        this.videoDetails.videoCover = result.data.videoCover;
        this.bannerList = result.data.bannerList;
        this.$nextTick(() => {
          // 渲染轮播
          new Swiper('.swiper-container', {
            loop: true,
            autoplay: true,
            slidesPerView: 'auto',
            centeredSlides: true,
            loopAdditionalSlides: 100,
            slidesPerView: 'auto',
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },
          });
        });
        Toast.clear();
      } else {
        Toast(result.retMsg);
      }
    },
    skipToInvite() {
      // 路由到邀请好友页面
      this.$router.push('/invitation');
      console.log('跳转到邀请好友页面');
    },
    skipToBuyVip() {
      // 路由到购买vip
      this.$router.push('/vipInfoDetails/1');
      console.log('跳转到购买vip页面');
    },
    commentPermit() {
      console.log('评论限制');

      // 等级判断，如果大于等于2级可以评论
      this.isPermitComment = true;
    },
    changeMovie(movie) {
      // 切换影片
      this.$router.replace(`/video/${movie.id}`);
      window.scrollTo(0, 0);
      console.log('切换影片');
    },
    collection() {
      if (this.videoDetails.isCare === '0') {
        this.sendCollection({
          videoId: this.videoId,
        });
      } else {
        Toast('已收藏');
      }
    },
    async sendCollection(params) {
      const result = await setCareHistory(params);
      if (result.retCode === '1') {
        this.videoDetails.isCare = '1';
        Toast('收藏成功');
      } else {
        Toast(result.retMsg);
      }
    },
    share() {
      // 复制一段内容到剪贴板
      let message = '';
      message += this.videoDetails.extensionInfo.extensionContext;
      message += this.videoDetails.extensionInfo.extensionUrl;
      this.$copyText(message).then(
        e => {
          Toast('请分享粘贴，已复制到系统剪贴板');
        },
        e => {
          Toast('粘贴失败，请重试');
        },
      );
    },
    upPraise() {
      if (this.videoDetails.isLike === '0') {
        this.sendPraise({
          videoId: this.videoId,
          careType: 1,
        });
      } else {
        Toast('已点赞');
      }
    },
    async sendPraise(params) {
      // 异步发送点赞请求
      const result = await setCareTimess(params);
      if (result.retCode === '1') {
        this.videoDetails.isLike = '1';
        this.videoDetails.careNum = this.videoDetails.careNum + 1;
        Toast('点赞成功');
      } else {
        Toast(result.retMsg);
      }
    },
    showMoreMovie(flag) {
      this.isShowMoreMovie = !this.isShowMoreMovie;
    },
    back() {
      this.$router.back();
    },
    onPlayerTimeupdate(player) {
      /* console.log('player Timeupdate!', player.currentTime()) */
      // 真实使用
      if (!(this.isVip === 1) && player.currentTime() >= this.payDuration) {
        player.pause();
        this.isPermitView = true;
      }
    },
  },
  watch: {
    $route(to, from) {
      this.videoId = this.$route.params.videoId;
      this.getVideoDetail(this.videoId);
    },
  },
};
</script>

<style lang="scss" scoped>
.video-wrapper {
  height: 276px;
  background: rgba(255, 255, 255, 0.3);
  margin-top: -50px;
}
.video-info {
  padding: 12px 15px;
}
.op-icon {
  width: 17px;
  height: 17px;
  margin-bottom: 8px;
  img {
    width: 100%;
  }
}
.van-icon-good-job-o {
  font-size: 18px;
}
.van-icon-star-o {
  font-size: 18px;
}
.bg {
  background: #21203c;
}
.swiper-item {
  margin: 0 10px;
  width: 289px;
  height: 84px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}
.comment-box {
  height: 60px;
  padding: 0 17px;
  background: rgba(45, 36, 100, 1);
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}
.guess-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 17px;
  padding-bottom: 14px;
  &:last-child {
    border-bottom: 0;
    margin-bottom: 0;
  }
}
.guess-item-cover {
  width: 126px;
  height: 71px;
  border-radius: 12px;
  // background-color: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 1;
}
.cover-logo {
  border-radius: 12px 0 12px 0;
}
.tag {
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 24px;
  border: 1px solid #9348ff;
}
.mc-purple {
  color: #9348ff;
}
.van-nav-bar {
  z-index: 10 !important;
}
.tag-box {
  max-height: 50px;
  overflow: hidden;
  align-items: flex-start;
}
</style>
<style lang="scss">
.video {
  .van-tabs__nav {
    background: transparent;
  }
  .van-tab.van-tab--active {
    background: transparent;
    border-radius: 0;
    font-size: 19px;
    font-weight: 600px;
  }
  .van-tab {
    flex: none;
    margin-right: 15px;
    padding: 0;
  }
  .van-tabs__line {
    background: linear-gradient(90deg, #e95aa0, #a769ff);
    min-width: 38px;
  }
  .van-tabs__wrap {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 20px;
  }
  .van-tag--plain {
    background: transparent;
  }
  .van-tag--round,
  .van-tag--round::after {
    border-radius: 20px;
  }
  .vjs-custom-skin > .video-js {
    height: 100%;
  }
}
</style>
