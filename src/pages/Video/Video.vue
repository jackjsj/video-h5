<template>
  <div class="bg flex-col vh100 video">
    <van-nav-bar
      class="flex-none"
      left-arrow
      @click-left="back()"
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
    <div class="flex-auto ova bg-2" ref="scroll">
      <!-- 信息 -->
      <div class="wh video-info">
        <p class="f18 fw500 mb10">{{videoDetails.videoName}}</p>
        <!-- 热度 时间 -->
        <div class="flex aic f14 fw400 mb20">
          <div class="flex aic mr18">
            <van-icon name="fire" color="#9348FF" />
            <p class="ml5 opa7">播放次数{{videoDetails.playNum}}</p>
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
            <div class="op-icon f18">
              <van-icon :name="videoDetails.isLike === '1' ? 'good-job':'good-job-o'" />
            </div>
            <div class="opa3">{{videoDetails.careNum}}</div>
            <!-- <div class="opa3">点赞</div> -->
          </div>
          <div class="flex-col aic"
            @click="downPraise">
            <div class="op-icon f18" style="transform:rotate(180deg);">
              <van-icon :name="videoDetails.isLike === '2' ? 'good-job':'good-job-o'" />
            </div>
            <div class="opa3">{{videoDetails.dislikeNum}}</div>
            <!-- <div class="opa3">差评</div> -->
          </div>
          <div class="flex-col aic"
            @click="collection">
            <div class="op-icon f18">
              <van-icon :name="videoDetails.isCare !=='0' ? 'star' :'star-o'" />
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
      <div class="p15 rel">
        <van-tabs
          :border="false"
          title-active-color="#fff"
          title-inactive-color="#A7ADB6"
          @change="onTabChange">
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
                <div class="flex mb5 aic">
                  <span class="opa5 flex-none mb5">影片类型：</span>
                  <div class="flex flex-wrap" v-if="videoDetails.tagTypes && videoDetails.tagTypeIds">
                    <p
                      style="border-width:1px;"
                      v-for="(item,index) in videoDetails.tagTypes.split(',')"
                      :key="item"
                      class="tag flex-none mr5 mb5"
                      @click="$router.push(`/movieClassifyList?tagType=${videoDetails.tagTypeIds.split(',')[index]}`)">{{item}}</p>
                  </div>
                </div>
                <div class="flex mb5 aic">
                  <span class="opa5 flex-none mb5">影片标签：</span>
                  <div class="flex flex-wrap" v-if="videoDetails.tags && videoDetails.tagsId">
                    <p
                      style="border-width:1px;"
                      v-for="(item,index) in videoDetails.tags.split(',')"
                      :key="item"
                      class="tag flex-none mr5 mb5"
                      @click="$router.push(`/movieTagList/${videoDetails.tagsId.split(',')[index]}/${Base64.encode(item)}`)">{{item}}</p>
                  </div>
                </div>
                <div class="flex aic mb5">
                  <span class="opa5 flex-none">影片番号：</span>
                  <span class="opa5">{{videoDetails.identifier}}</span>
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
                    <div class="flex-auto ovh jcb flex-col">
                      <div class="flex-none">
                        <p class="opa9 f14 fw500 mb5 van-multi-ellipsis--l2">{{item.videoName}}</p>
                        <div class="flex flex-wrap mb5 pct100 tag-box" v-if="item.tagsName && item.tagsId">
                          <p
                            v-for="(tag,index) in item.tagsName.split(',')"
                            :key="tag"
                            class="tag flex-none mr5 mb5"
                            @click.stop="$router.push(`/movieTagList/${item.tagsId.split(',')[index]}/${Base64.encode(tag)}`)">{{tag}}</p>
                        </div>
                      </div>
                      <div class="flex jcb opa5">
                        <div class="flex aic">
                          <van-icon name="play-circle" />
                          <span class="ml5">{{item.playNum}}</span>
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
          <van-tab :title="`评论(${videoDetails.videoCommentNum || 0})`">
            <div class="mt-15">
              <div class="flex pb15 pt15"
                style="border-bottom:1px solid rgba(216, 216, 216,.1);"
                v-for="item in comments" :key="item.id">
                <div class="flex jcc avatar comment-avatar ovh mr12 flex-none">
                  <van-image fit="cover" :src="defaultAvatar" />
                </div>
                <div class="flex-auto wh f400">
                  <p class="f14">{{item.nickName || '游客'}}</p>
                  <p style="color:#BBBBC4;" class="mb5 lh1">{{item.comTime}}</p>
                  <p class="f15">{{item.comContent}}</p>
                </div>
              </div>
            </div>

          </van-tab>
        </van-tabs>
        <!-- <div class="abs comment-btn"
          @click="showCommentBox">
          <img src="@/assets/images/edit.png" />
        </div> -->
      </div>
    </div>
    <!-- 评论 -->
    <div class="flex-none comment-box flex aic wh">
      <div class="flex flex-none jcc avatar ovh mr12">
        <van-image fit="cover" :src="memberInfo.headpic ? memberInfo.headpic : defaultAvatar" />
      </div>
      <div class="flex-auto">
        <van-field class="f14 fw400 comment-input" v-model="commentContent" placeholder="快来说说你的感想吧"
          @keydown.enter="commentOn" ref="commentInput" />
      </div>
    </div>
    <!-- 弹出框 -->

    <van-dialog
      v-model="dialogVisible"
      message="邀请好友或者购买vip会员，就可以无限制观看视频啦"
      cancelButtonText='邀请好友'
      confirmButtonText='购买vip'
      show-cancel-button
      @confirm="$router.push('/vipCreditAdd')"
      @cancel="$router.push('/invitation')">
      <template #title>
        <div class="rel">
          <p>非常抱歉，您的观影次数已经用完</p>
          <p class="abs dialog-close-btn"
            @click="dialogVisible = false;">
            <van-icon name="cross" />
          </p>
        </div>
      </template>
    </van-dialog>
    <van-dialog
      class="comment-box-dialog"
      v-model="commentBoxVisible"
      cancelButtonText='取消'
      confirmButtonText='确定'
      show-cancel-button>
      <div class="flex-col jcb aic cb-dialog-content">
        <p class="f16 b">提示</p>
        <p class="f16">请填写您的评论</p>
        <div class="pct100">
          <input class="comment-input" />
        </div>
      </div>
    </van-dialog>
    <van-popup
      class="tip-popup"
      v-model="tipVisible"
      position="center"
      closeable>
      <p class="mb10">用户等级2级或开通VIP才可发表评论，邀请好友就可以升级啦！
      </p>
      <div>
        <van-button class="tip-popup-btn"
          @click="$router.push('/invitation')">邀请好友</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import 'swiper/css/swiper.min.css';
import Swiper from 'swiper';
import { videoPlayer, setCareTimes } from 'vue-video-player';
import {
  getVideoDetail,
  setCareHistory,
  setCareTimess,
  getMemberInfo,
  commentOn,
  getComments,
  checkInAddIntegral,
} from '@/api';
import './css/custom-theme.css';

export default {
  components: {
    videoPlayer,
  },
  data() {
    return {
      routerFrom: {},
      tipVisible: false,
      comments: [],
      commentContent: '',
      commentBoxVisible: false,
      Base64,
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
        muted: false, // 默认情况下将会消除任何音频。
        language: 'zh-CN',
        controls: true, // 控制条
        preload: 'auto', // 视频预加载
        loop: false, // 导致视频一结束就重新开始。 //播放速度
        /* playbackRates: [0.7, 1.0, 1.5, 2.0], */
        // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
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
      dialogVisible: false,
    };
  },
  watch: {
    $route(to, from) {
      this.$refs.scroll.scrollTop = 0;
      this.videoId = this.$route.params.videoId;
      this.getVideoDetail(this.videoId);
    },
  },
  mounted() {
    this.$route.meta.isBack = false;
    this.videoId = this.$route.params.videoId;
    this.getVideoDetail(this.videoId);
    // 获取当前用户信息
    this.memberInfo = JSON.parse(localStorage.getItem('memberInfo') || {});
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {
    back() {
      this.$route.meta.isBack = true;
      this.$router.back();
    },
    async getComments() {
      const resp = await getComments({
        videoId: this.videoId,
        lastNew: '1',
      });
      if (resp.retCode === '1') {
        this.comments = resp.data;
      }
    },
    onTabChange(name) {
      if (name === 1) {
        // 加载评论
        this.getComments();
      }
    },
    async commentOn() {
      const comContent = this.commentContent;
      this.commentContent = '';
      this.$refs.commentInput.blur();
      const { sortNo, isVip } = this.memberInfo;
      if (sortNo >= 2 || isVip === 1) {
        if (comContent.trim()) {
          const resp = await commentOn({
            videoId: this.videoId,
            comContent,
          });
          Toast(resp.retMsg);
        } else {
          Toast('评论不能为空');
        }
      } else {
        this.tipVisible = true;
      }
    },
    // 显示评论输入框
    showCommentBox() {
      this.commentBoxVisible = true;
    },
    async addIntegral() {
      const id = 3;
      const result = await checkInAddIntegral(id);
      if (result.retCode === '1') {
        Toast('任务完成');
      } else {
        Toast(`任务失败:${result.retMsg}`);
      }
    },
    // 处理广告跳转
    onSwiperClick(item) {
      this.addIntegral(3);
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
        Toast('已操作');
      }
    },
    downPraise() {
      if (this.videoDetails.isLike === '0') {
        this.sendPraise({
          videoId: this.videoId,
          careType: 2,
        });
      } else {
        Toast('已操作');
      }
    },
    async sendPraise(params) {
      // 异步发送点赞请求
      const { careType } = params;
      const result = await setCareTimess(params);
      if (result.retCode === '1') {
        if (careType === 1) {
          this.videoDetails.isLike = '1';
          this.videoDetails.careNum = this.videoDetails.careNum + 1;
        } else {
          this.videoDetails.isLike = '2';
          this.videoDetails.dislikeNum = this.videoDetails.dislikeNum + 1;
        }
        Toast('操作成功');
      } else {
        Toast(result.retMsg);
      }
    },
    showMoreMovie(flag) {
      this.isShowMoreMovie = !this.isShowMoreMovie;
    },
    /**
     * 播放次数用完后 0次之后 再点击视频观看，就会弹出提示
     * 您的观影次数已经用完 然后底下显示， “邀请好友” “开通会员”
     * 假如是vip用户 是可以无限观影，可以无视次数用完
     */
    onPlayerTimeupdate(player) {
      if (this.isVip !== 1 && player.currentTime() >= this.payDuration) {
        this.dialogVisible = true;
        player.pause();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.van-icon-arrow-left {
  font-weight: bolder;
}
.video-wrapper {
  height: 211px;
  background: rgba(255, 255, 255, 0.3);
  // margin-top: -50px;
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
  width: 170px;
  height: 110px;
  border-radius: 12px;
  // background-color: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 1;
}
.cover-logo {
  border-radius: 12px 0 12px 0;
}
.tag {
  padding: 0 7px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  border-radius: 24px;
  color: #fff;
  background: linear-gradient(
    90deg,
    rgba(233, 90, 160, 0.6),
    rgba(167, 105, 255, 0.6)
  );
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
.dialog-close-btn {
  top: -15px;
  right: 10px;
}
.comment-btn {
  top: 32px;
  right: 20px;
  img {
    width: 17px;
    height: 17px;
  }
}
.comment-avatar {
  width: 35px;
  height: 35px;
}
.comment-input {
  background: transparent;
}
.tip-popup {
  border-radius: 8px;
  padding: 40px 40px 20px;
  box-sizing: border-box;
  width: 80%;
  font-size: 14px;
}
.tip-popup-btn {
  height: 50px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(232, 86, 157, 1) 0%,
    rgba(147, 72, 255, 1) 100%
  );
  border-radius: 25px;
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  border: none;
  outline: none;
  margin-top: 10px;

  &:active {
    opacity: 0.7;
  }
}
</style>
<style lang="scss">
.video {
  .comment-box-dialog {
    width: 318px;
    background: #1b1e23;
    color: #aaa;
    border-radius: 0;
    .comment-input {
      width: 100%;
      border-radius: 5px;
      padding: 0 5px;
      box-sizing: border-box;
      height: 30px;
      color: #333;
      font-size: 14px;
    }
    .cb-dialog-content {
      height: 170px;
      padding: 25px 18px 35px;
      box-sizing: border-box;
      line-height: 1;
    }
    button.van-button {
      color: #aaa;
      height: 40px;
      line-height: 40px;
      background: transparent !important;
      &.van-dialog__confirm {
        color: #ae4a64;
      }
    }
  }
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
