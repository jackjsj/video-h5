<template>
  <div class="video">
    <!--<scroller  lock-x scrollbar-y ref="scroller"  style="margin-bottom: 6rem">-->
    <div class="item" style="background-color: aliceblue ">
      <div class="returnContainer">
        <i class="iconfont" style="font-size: 2rem ;margin: 1rem;color: #18b4ed" @click="back">&#xe629;</i>
        <span></span>

      </div>
      <div class="player">
        <video-player id="broadcast" class="vjs-custom-skin" style="width: 100% ;height: 30%"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
          @timeupdate="onPlayerTimeupdate($event)">
        </video-player>
      </div>
    </div>

    <div class="" style="background-color: #ffffff;">
      <flexbox>
        <flexbox-item :span="3/5">
          <span class="filmName">{{this.videoDetails.videoName}}</span>
        </flexbox-item>

        <flexbox-item :span="1/10">
          <span @click="upPraise" v-show="!isUpPraise" class="icon iconfont fabulousSymbolLeft" style="font-size: 1.5rem">&#xe7b6;</span>
          <!--点击红色的赞-->
          <span @click="upPraise" v-show="isUpPraise" class="icon iconfont fabulousSymbolLeft" style="font-size: 1.5rem">&#xe633;</span>
        </flexbox-item>
        <flexbox-item :span="1/7" class="fabulous">
          <x-progress style="width: 4rem ;margin: 0 auto" :percent="videoDetails.cent.substring(0,videoDetails.cent.length-1)>0?videoDetails.cent.substring(0,videoDetails.cent.length-1):0" :show-cancel="false"></x-progress>
          <span class="fabulousNumber">{{videoDetails.cent}}满意</span>
        </flexbox-item>
        <flexbox-item :span="1/11">
          <!--点击灰色的赞-->
          <span @click="DownPraise" v-show="isDownPraise" class="icon iconfont fabulousSymbolRight" style="font-size: 1.5rem">&#xe7b8;</span>
          <span @click="DownPraise" v-show="!isDownPraise" class="icon iconfont fabulousSymbolRight" style="font-size: 1.5rem">&#xe7b7;</span>
        </flexbox-item>
      </flexbox>
      <div class="time">
        <span>{{videoDetails.pushTime}}</span>
        <span>{{videoDetails.playNum}}次播放</span>
      </div>
    </div>
    <div class="briefIntroduction">
      <span>{{videoDetails.briefContent.substring(0,17)}}</span>
      <button @click="show = !show"> 简介 ></button>
    </div>

    <div class="commentStatistics">
      <span>热门评论</span>
      <span @click="share" class="icon iconfont commentStatisticsRight" style="font-size: 2rem;">&#xe66a;</span>
      <span @click="collection(videoId)" v-show="isAlreadyCollection" class="icon iconfont commentStatisticsRight" style="font-size: 2rem;color:#DA6263">&#xe64b;</span>
      <span @click="collection(videoId)" v-show="!isAlreadyCollection" class="icon iconfont commentStatisticsRight" style="font-size: 2rem;">&#xe64b;</span>
      <span class="icon iconfont commentStatisticsRight" style="font-size: 2rem;">&#xe665;</span>
    </div>
    <div class="advertisement">
      <img :src="banner.picUrl" @click="handlerBanner" alt="">
    </div>
    <div class="like">
      <span>猜你喜欢</span>
    </div>
    <div class="filmContainer" @click="changeMovie(item)" v-for="(item,index) in videoDetails.likeVideoList" :key="index">
      <a href="javaScript:" v-show="isShowMoreMovie||(index>=0&&index<3)">
        <div class="film">
          <img :src="item.videoCover" alt="">
        </div>
        <div class="ranking">
          <span>{{item.tagsName.slice(0,17)}}</span>
          <span class="timeSpan">{{item.playNum}}次播放</span>
          <span class="timeSpan">{{item.pushTime}}</span>
        </div>
      </a>
    </div>
    <br>
    <span @click="showMoreMovie" v-show="isShowMoreMovie&&videoDetails.likeVideoList.length>0" style="justify-content:center; display: flex;color:  #AA845D;font-family:'楷体';">收起&#8593;</span>
    <br>

    <hr>
    <div class="comment">
      <span>全部评论</span><span style="font-size: 0.8rem ;color: #cccccc;margin-left: 0.5rem">{{videoDetails.videoCommentNum}}条</span>
    </div>
    <hr>
    <div class="commentContainer" :index="i" v-for="i in 2" v-show="videoDetails.videoCommentNum">
      <div class="user">
        <img class="headPortrait" src="../../img/Icon/1.jpg" alt="">
        <span class="gender"></span>
        <span>{{videoDetails.pushTime}}</span>
      </div>
      <div class="comment1">
        <span>没用</span>
      </div>
    </div>

    <div class="blank">

    </div>

    <div class="footer" @click="commentPermit">
      <img src="../../img/Icon/1.jpg" alt="">
      <div class="footerButton">
        <span>快来说说你的感想</span>
      </div>
    </div>

    <!-- 弹窗组件 -->
    <div v-transfer-dom>
      <popup v-model="show" height="50%">
        <div class="popup1">
          <span class="title" style="justify-content:center;font-size: 1.2rem">
            {{videoDetails.briefContent}}
          </span>
          <hr>
          <span>
            简介
            <br />
            {{videoDetails.briefContent}}
          </span>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="isPermitView" class="dialog-demo">
        <div @click="isPermitView=false" style="float: right">
          <span style="color: #dfa432;" class="vux-close"></span>
        </div>
        <p style="color:#fff;text-align:center;">
          <br>
          <div>非常抱歉，您的使用时间已到</div>
          <div></div>
          <div>邀请好友或者购买<span style="color: red;">vip会员</span> ，就可以无限制观看视频啦</div>
          <div></div>
          <XButton @click.native="skipToInvite" style="background-color: #dfa432;color: white" mini>邀请好友</XButton> &nbsp;
          <XButton @click.native="skipToBuyVip" style="background-color: #dfa432;color: white" mini>购买vip会员</XButton>
      </x-dialog>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="isPermitComment" class="dialog-demo">
        <div @click="isPermitComment=false" style="float: right">
          <span style="color: #dfa432;" class="vux-close"></span>
        </div>
        <p style="color:#fff;text-align:center;">
          <br>
          <div>用户2等级才可以发表评论，邀请好友就可以升级啦！</div>
          <br>
          <XButton @click.native="skipToInvite" style="background-color: #dfa432;color: white" mini="true">邀请好友</XButton> &nbsp;
      </x-dialog>
    </div>
    <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="showToastMsg" position="buttom"></toast>
    <!--</scroller>-->

  </div>

</template>

<script>
import { videoPlayer, setCareTimes } from 'vue-video-player';
import {
  Toast,
  XHeader,
  Scroller,
  Tabbar,
  TabbarItem,
  Flexbox,
  FlexboxItem,
  XProgress,
  Popup,
  XDialog,
  XButton,
  TransferDomDirective as TransferDom,
} from 'vux';
import { getVideoDetail, setCareHistory, setCareTimess } from '../../api';

import './css/custom-theme.css';

export default {
  directives: {
    TransferDom,
  },
  components: {
    videoPlayer,
    Scroller,
    XHeader,
    Tabbar,
    TabbarItem,
    Flexbox,
    FlexboxItem,
    XProgress,
    Popup,
    XDialog,
    XButton,
    Toast,
  },
  data() {
    return {
      banner: {},
      payDuration: 60,
      isVip: 1,
      isShowMoreMovie: false, //是否显示更多电影
      isAlreadyCollection: false, //是否已经点过喜欢
      isAlreadyPraise: false, //是否已经点过赞
      showToastMsg: '',
      showToast: false,
      videoId: '',
      isUpPraise: false, //是否点赞
      isDownPraise: false, //是否点差评点赞
      show: false,
      // videojs options
      playerOptions: {
        height: '260',
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: true, //默认情况下将会消除任何音频。
        language: 'zh-CN',
        controls: true, //控制条
        preload: 'auto', //视频预加载
        loop: false, //导致视频一结束就重新开始。 //播放速度
        /*playbackRates: [0.7, 1.0, 1.5, 2.0],*/ aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            /* type: "video/mp4",*/
            type: 'application/x-mpegURL',
            /* src: "http://vjs.zencdn.net/v/oceans.mp4",*/
            /*http://v1.727831.com/20190914/YR0JZ3Lp/index.m3u8*/
            src: '',
          },
        ],
        poster: '', //未播放时封面图片
        width: document.documentElement.clientWidth,
        notSupportedMessage: '加载中，请耐心等待或者重新点击影片', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      videoDetails: {
        useView: '1',
        payDuration: 60, //允许播放时间
        isVip: 1, //是否vip  1为vip
        briefContent: '',
        starId: 14,
        isLike: '0',
        cent: '67.0%', //点赞比例
        bannerListHead: [],
        briefContext: null,
        starVideoNum: 634, //播放次数
        videoUrl: 'http://v2.727831.com/20190914/MqipcZML/index.m3u8', //播放地址
        bannerList: [],
        videoName: 'ときめき 剛毛マンコは嫌いですか加藤椿',
        starName: '无码',
        playTime: null,
        id: 8759,
        heightNum: '170',
        pushTime: '2019-09-17',
        classifyName: '无码',
        starVideoList: [],
        extensionInfo: '',
        videoType: 2,
        playNum: '4724',
        dislikeNum: 1,
        headPic: 'group1/M00/00/13/wKhfFV0sU26AFVEmAAB_Vd18BZ4357.png',
        tags: '【肛交口交】,【体射颜射】',
        videoCommentNum: 0, //评论条数
        careNum: 2,
        bwh: null,
        videoCoverType: 1,
        likeVideoList: [],
        videoCover: '',
        isCare: '0',
        loseNum: 0,
        cup: '大陆',
      },
      isPermitView: false, //是否允许用户观看
      isPermitComment: false, //是否允许用户评论
    };
  },
  mounted() {
    this.videoId = this.$route.params.videoId;
    this.getVideoDetail(this.videoId);
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {
    // 处理广告跳转
    handlerBanner() {
      switch (this.banner.linkType) {
        case 1: {
          // 外部链接
          window.location.href = banner.linkUrl;
          break;
        }
        case 3: {
          //购买vip
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
    //发送请求获取影片数据
    async getVideoDetail(videoId) {
      this.$vux.loading.show({
        text: '',
      });
      const params = {
        videoId: videoId,
      };
      const result = await getVideoDetail(params);
      if (result.retCode === '1') {
        this.playerOptions.sources[0].src = result.data.videoUrl;
        this.playerOptions.sources[0].type = 'application/x-mpegURL';
        this.videoDetails = result.data;
        this.isVip = result.isVip;
        this.payDuration = result.payDuration;

        this.videoDetails.videoCover = result.data.videoCover;

        this.banner = result.data.bannerList[0] || null;
      } else {
        this.showToastMsg = '服务器繁忙';
        this.showToast = true;
      }
      this.$vux.loading.hide();
    },
    skipToInvite() {
      //路由到邀请好友页面
      this.$router.push('/invitation');
      console.log('跳转到邀请好友页面');
    },
    skipToBuyVip() {
      //路由到购买vip
      this.$router.push('/vipInfoDetails/1');
      console.log('跳转到购买vip页面');
    },
    commentPermit() {
      console.log('评论限制');

      //等级判断，如果大于等于2级可以评论
      this.isPermitComment = true;
    },
    changeMovie(movie) {
      //切换影片
      this.$router.replace(`/video/${movie.id}`);
      window.scrollTo(0, 0);
      console.log('切换影片');
    },
    collection(videoId) {
      //点击收藏，如果没有登录，跳转到登录页面
      console.log('收藏');
      let params = {
        videoId: videoId,
      };
      this.sendCollection(params);
    },
    async sendCollection(params) {
      const result = await setCareHistory(params);
      if (result.retCode === '1') {
        this.isAlreadyCollection = true;
        this.showToastMsg = '收藏成功';
        this.showToast = true;
        console.log('收藏成功');
      }
    },
    share() {
      //复制一段内容到剪贴板
      let message = '';
      message += this.videoDetails.extensionInfo.extensionContext;
      message += this.videoDetails.extensionInfo.extensionUrl;

      this.$copyText(message).then(
        (e) => {
          this.showToastMsg = '请分享粘贴，已复制到系统剪贴板';
          this.showToast = true;
        },
        (e) => {
          this.showToastMsg = '粘贴失败，请重试';
          console.log(e);
        },
      );
    },
    upPraise() {
      if (!this.isAlreadyPraise) {
        let params = {
          videoId: this.videoId,
          careType: 1,
        };
        this.sendPraise(params);
      }
    },
    async sendPraise(params) {
      //异步发送点赞请求
      const result = await setCareTimess(params);

      console.log(result);
      if (result.retCode === '1') {
        if (!this.isDownPraise) {
          this.isUpPraise = !this.isUpPraise;
          this.isAlreadyPraise = true;
        }
        this.showToastMsg = '点赞成功';
        this.showToast = true;
        console.log('点赞成功');
      } else {
        this.showToastMsg = '点赞失败';
        this.showToast = true;
        console.log('点赞失败');
      }
    },
    DownPraise() {
      //差评点赞
      console.log('差评点赞');
      if (!this.isAlreadyPraise) {
        if (!this.isUpPraise) {
          this.isDownPraise = !this.isDownPraise;
        }
        this.isAlreadyPraise = true;
        this.showToastMsg = '提交成功';
        this.showToast = true;
      }
    },
    showMoreMovie(flag) {
      console.log('----');
      this.isShowMoreMovie = !this.isShowMoreMovie;
    },
    back() {
      this.$router.back();
    },
    onPlayerTimeupdate(player) {
      /*console.log('player Timeupdate!', player.currentTime())*/
      //真实使用
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

<style  scoped lang="scss">
// @import '~vux/src/styles/close';
.ignore {
  /* 弹窗组件*/
  .popup0 {
    padding-bottom: 15px;
    height: 200px;
  }
  .popup1 {
    width: 100%;
    height: 100%;
  }
  .popup2 {
    padding-bottom: 15px;
    height: 400px;
  }
  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 15px;
  }
  .position-horizontal-demo {
    position: relative;
    height: 100%;
    .vux-close {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%) scale(4);
      color: #000;
    }
  }

  .dialog-demo {
    .weui-dialog {
      border-radius: 8px;
      padding-bottom: 8px;
    }
    .dialog-title {
      line-height: 30px;
      color: #666;
    }
    .img-box {
      height: 350px;
      overflow: hidden;
    }
    .vux-close {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

  .video .filmName {
    /*文本自动换行*/
    font-weight: bold;
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    margin: 1rem 0 0 1rem;
  }
  .video .fabulousSymbolLeft {
    margin-left: 0.9rem;
  }
  .video .fabulousSymbolRight {
    /*margin-right: 0.9rem;*/
  }

  .video .fabulousNumber {
    color: red;
    width: 120%;
    font-size: 0.2rem;
    margin: 0 auto;
  }
  .video .fabulous {
    margin: 0 auto;
    text-align: center;
  }
  .video .time {
    margin: 0.5rem 1rem;
  }
  .video .briefIntroduction {
    width: 93%;
    height: 1.5rem;
    margin: 0.5rem 1rem 1.5rem 1rem;
    /*word-break: break-all;*/
    /*background-color: #F3F3F3;*/
    word-wrap: break-word;
    word-break: normal;
    background-color: whitesmoke;
  }
  .video .briefIntroduction span {
    color: #000000;
    /* overflow: hidden;*/
    word-wrap: break-word;
    /*word-break: normal;*/
    /*text-overflow: ellipsis;*/
    /*-o-text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
    width: 80%;
    display: inline-block;
    word-break: break-all;
  }
  .video .briefIntroduction button {
    color: #c49c69;
    font-size: 1rem;
    float: right;
    background-color: transparent;
    border-style: none;
  }
  .video .commentStatistics {
    margin: 0 0 1rem 1rem;
  }

  .video .commentStatistics span {
    font-size: 1rem;
  }
  .video .commentStatistics .commentStatisticsRight {
    float: right;
    margin-right: 1rem;
  }
  .video .advertisement img {
    width: 90%;
    height: 8rem;
    margin: 1rem 1rem;
    border-radius: 1rem;
  }
  .video .like {
    font-size: 1.3rem;
    margin-left: 1rem;
  }

  .video .filmContainer {
    width: 95%;
    margin: 1rem 0.5rem;
  }
  .video .filmContainer a {
    text-decoration: none;
  }
  .video .filmContainer .ranking {
    width: 40%;
    display: inline-block;
  }
  .video .filmContainer .ranking span {
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    color: black;
    text-align: left;
    margin: 6% 5%;
  }
  .video .filmContainer .ranking .timeSpan {
    font-size: 1rem;
    color: #cccccc;
  }
  .video .filmContainer .film {
    width: 50%;
    display: inline-block;
  }
  .video .filmContainer .film img {
    width: 100%;
    height: 100%;
  }

  .comment {
    color: black;
    padding: 1rem 1rem;
    border-top: 0rem solid #000000;
    border-bottom: 0 solid #000000;
    /*border-radius:0.5rem;*/
  }
  .commentContainer {
    padding: 1rem;
    border-bottom: 0.1rem solid #f5f5f5;
  }
  .commentContainer .headPortrait {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
  }
  .commentContainer .gender {
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;
  }

  .commentContainer .user span {
    color: black;
    font-size: 0.9rem;
  }
  .commentContainer .comment1 {
    color: #000000;
    word-wrap: break-word;
    width: 90%;
    margin: 1rem 1rem;
  }
  .video .blank {
    margin-bottom: 5rem;
  }

  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    z-index: 99999;
    border-top: 0.1rem solid #f5f5f5;
  }
  .footer img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    /*margin: 0.5rem;*/
    position: relative;
    top: 0.6rem;
    margin: 0 0.5rem;
  }

  .footer .footerButton {
    width: 75%;
    text-align: center;
    border: 0.07rem solid #000000;
    border-radius: 5rem;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  .footer .footerButton span {
    font-size: 1rem;
    display: inline-block;
    width: 100%;
    margin: 0 auto;
    padding: 3% 0;
  }

  .player {
    position: relative;
  }

  .returnContainer:before,
  .returnContainer:after {
    content: '';
    display: table;
    clear: both;
  }

  .returnContainer {
    width: 90%;
    font-size: 1.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    position: absolute;
    z-index: 9999;
  }
}
</style>
