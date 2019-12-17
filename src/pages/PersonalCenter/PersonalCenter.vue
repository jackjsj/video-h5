<template>
  <div class="bg flex-col mine">
    <van-nav-bar
      class="flex-none"
      :border="false">
      <van-icon name="setting-o" slot="right"
        @click="$router.push('/setUp')" />
    </van-nav-bar>
    <div class="flex-auto ova content">
      <!-- 用户信息 -->
      <div class="flex-col aic">
        <div class="avatar flex jcc">
          <van-image :src="memberInfo.headpic ? memberInfo.headpic : defaultAvatar" />
        </div>
        <p class="username f20 fw400 wh">{{memberInfo.nickName}}</p>
        <p class="username f12 fw400 wh" v-if="memberInfo.isVip">VIP有效期至{{memberInfo.vipDate}}</p>
        <div class="flex pct100 jcb g9 mt20">
          <div class="flex-col flex1 jcb aic user-info-item">
            <div class="flex aic wh">
              <img class="integral-icon" src="@/assets/images/积分.png" />
              <span class="f12 mr5 ml5">X</span>
              <span class="f24">{{memberInfo.integralNumber}}</span>
            </div>
            <p>我的积分</p>
          </div>
          <div class="flex-col flex1 jcb aic user-info-item">
            <button class="user-info-btn wh"
              style="border-width:1px;"
              @click="$router.push('/integralDetail')">积分详情</button>
            <p>积分可兑换会员</p>
          </div>
          <div class="flex-col flex1 jcb aic user-info-item">
            <button class="user-info-btn yellow"
              style="border-width:1px;"
              @click="signUp">签到</button>
            <p>每日签到</p>
          </div>
        </div>
      </div>
      <!-- 会员中心 -->
      <div class="mt30">
        <p class="wh f16 fw400 pl20">会员中心</p>
        <div class="bar rel" v-if="!memberInfo.tel"
          @click="$router.push('/register')">
          <img src="@/assets/images/bar.png" />
          <div class="abs register-bar wh flex-col jcc aic">
            <p class="f20">立即注册</p>
            <p class="f12 g9">获取更多观影次数和金币</p>
          </div>
        </div>
      </div>
      <!-- 次数统计 -->
      <div class="flex mt30 mb25">
        <div
          class="flex1 tc count-item flex-col jcb fw500"
          style="border-width:1px;"
          v-for="item in countItems"
          :key="item.name">
          <p class="wh f24">{{item.count>0?item.count:0}}</p>
          <p class="g9 f12 ">{{item.name}}</p>
        </div>
      </div>
      <!-- swiper -->
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
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
      </div>
      <!-- <div class="swiper-wrapper">
          <van-swipe
            :autoplay="300000"
            indicator-color="#FF7AC8">
            <van-swipe-item v-for="(item) in bannerList"
              :key="item.id"
              @click="onSwiperClick(item)">
              <div class="swiper-item flex jcc ovh">
                <van-image :src="item.picUrl" />
              </div>
            </van-swipe-item>
          </van-swipe>
        </div> -->
      <!-- 功能列表 -->
      <div class="flex flex-wrap mt30 mb30">
        <div
          class="flex-col aic item jcb g9"
          v-for="item in items"
          :key="item.name"
          @click="onItemClick(item)">
          <div class="item-icon flex aic jcc mb10">
            <img :src="item.icon" />
          </div>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <van-dialog
      v-model="dialogVisible"
      show-cancel-button
      @confirm="onDialogConfirm"
      @cancel="onDialogCancel">
      <div class="flex-col aic">
        <div class="warn-icon">
          <img src="@/assets/images/warn.png" />
        </div>
        <p class="g0 mb8 f18 lh24">提示</p>
        <p class="g8 mb20 f15">您的登录已过期，是否重新登录</p>
      </div>
    </van-dialog>
    <van-overlay :show="overlayVisible" />

  </div>
</template>

<script>
import 'swiper/css/swiper.min.css';
import Swiper from 'swiper';
import { getMemberInfo, getGcGroup, checkInAddIntegral } from '@/api';

const countItems = [
  {
    name: '今日观影次数',
    count: 0,
  },
  {
    name: '小视频次数',
    count: 0,
  },
  {
    name: '下载',
    count: 0,
  },
];

export default {
  data() {
    return {
      isVip: 0, // 是否是vip
      vipDate: '', // vip到期时间
      personal: {},
      width: screen.availWidth,
      height: screen.availHeight,
      showToastMsg: '',
      showToast: false,
      location: window.location,
      //
      countItems,
      items: [
        {
          name: '会员充值',
          icon: require('@/assets/images/会员充值.png'),
          to: '/vipCreditAdd',
        },
        {
          name: '积分管理',
          icon: require('@/assets/images/积分管理.png'),
          to: '/vipInfoDetails/1',
        },
        {
          name: '邀请好友',
          icon: require('@/assets/images/邀请好友.png'),
          to: '/invitation',
        },
        {
          name: '我的收藏',
          icon: require('@/assets/images/我的收藏.png'),
          to: '/myCollections',
        },
        {
          name: '观看记录',
          icon: require('@/assets/images/观看记录.png'),
          to: '/viewHistory',
        },
        {
          name: '下载记录',
          icon: require('@/assets/images/下载记录.png'),
          to: '/offlineCache',
        },
        {
          name: '火爆交流群',
          icon: require('@/assets/images/火爆交流群.png'),
          onClick: () => {
            this.gcGroup && (window.location.href = this.gcGroup);
          },
        },
        {
          name: '联系客服',
          icon: require('@/assets/images/联系客服.png'),
          onClick: () => {
            this.qqUrl && (window.location.href = this.qqUrl);
          },
        },
        {
          name: '手势密码',
          icon: require('@/assets/images/手势密码.png'),
          to: '/gestureLock',
        },
      ],
      qqUrl: '', // 客服地址
      gcGroup: '', // 聊天群地址
      defaultAvatar: require('@/assets/images/avatar.png'),
      memberInfo: {}, // 用户信息
      bannerList: [], // 轮播
      overlayVisible: false,
      dialogVisible: false,
    };
  },
  mounted() {
    this.getMemberInfo();
    // 获取聊天群
    this.getGcGroup();
  },
  methods: {
    onDialogConfirm() {
      localStorage.removeItem('token');
      localStorage.removeItem('loginType');
      this.$router.push('/login');
    },
    onDialogCancel() {
      localStorage.removeItem('token');
      localStorage.removeItem('loginType');
      this.dialogVisible = false;
      window.location.reload();
    },
    onSwiperClick(banner) {
      this.addIntegral(3);
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
    // 签到
    signUp() {
      this.addIntegral(1);
    },
    async addIntegral(id) {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
      });
      const result = await checkInAddIntegral(id);
      if (result.retCode === '1') {
        await this.getMemberInfo();
        Toast('签到成功');
      } else {
        Toast(result.retMsg);
      }
    },
    onItemClick(item) {
      if (item.to) {
        this.$router.push(item.to);
      }
      if (item.onClick) {
        item.onClick();
      }
    },
    async getGcGroup() {
      const result = await getGcGroup();
      if (result.retCode === '1') {
        this.gcGroup = result.data.href_url;
      }
    },
    async getMemberInfo() {
      this.overlayVisible = true;
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const result = await getMemberInfo({});
      Toast.clear();
      this.overlayVisible = false;
      if (result.retCode === '1' && result.httpCode === 200) {
        this.personal = result.data;
        this.memberInfo = this.personal.memberInfo;
        this.bannerList = this.personal.bannerList;
        this.qqUrl = result.data.qqurl;
        this.isVip = result.data.memberInfo.isVip;
        this.vipDate = result.data.memberInfo.vipDate;
        this.countItems[0].count =
          this.memberInfo.viewNum - this.memberInfo.usedViewNum;
        this.countItems[1].count = this.memberInfo.tmpViewNum;
        this.countItems[2].count = this.memberInfo.usedCacheNum;
        // 保存用户id
        localStorage.setItem('memberInfo', JSON.stringify(this.memberInfo));
        this.$store.dispatch('saveUserId', this.personal.memberInfo.id);
        this.$nextTick(() => {
          // 渲染轮播
          new Swiper('.swiper-container', {
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
            },
            loopAdditionalSlides: 100,
            slidesPerView: 'auto',
            centeredSlides: true,
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },
          });
        });
      } else if (result.httpCode === 801) {
        if (localStorage.getItem('loginType') === '1') {
          this.checkIsLayout();
        } else {
          this.onDialogCancel();
        }
      } else {
        Toast(result.msg);
      }
    },
    copyInviteCode(copyContent) {
      this.$copyText(copyContent).then(
        e => {
          this.showToastMsg = '复制成功';
          this.showToast = true;
        },
        e => {
          console.log(e);
        },
      );
    },
    checkIsLayout() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: -20px;
}
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.1);
}
.integral-icon {
  width: 18px;
  height: 18px;
}
.user-info-item {
  height: 48px;
  border-right: 1px solid rgba(151, 151, 151, 0.3);
  &:last-child {
    border-right: 0;
  }
}
.user-info-btn {
  width: 86px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid rgba(255, 250, 255, 1);
  background: transparent;
  &.yellow {
    color: #fff986;
    border-color: #fff986;
  }
  &:active {
    opacity: 0.7;
  }
}
.bar {
  margin-top: 10px;
  height: 101px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  img {
    width: 100%;
  }
}
.register-bar {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.count-item {
  border-right: 1px solid rgba(151, 151, 151, 0.3);
  height: 48px;
}
.swiper-item {
  width: 289px;
  height: 84px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  margin: 5px;
  // margin: auto;
}
.item {
  width: 33%;
  padding: 15px 0;
  border-bottom: 1px solid rgba(151, 151, 151, 0.3);
  border-right: 1px solid rgba(151, 151, 151, 0.3);
  &:nth-child(3n) {
    border-right: 0;
  }
  &:nth-last-child(3) {
    border-bottom: 0;
  }
  &:nth-last-child(2) {
    border-bottom: 0;
  }
  &:nth-last-child(1) {
    border-bottom: 0;
  }
  &:active {
    opacity: 0.7;
  }
}
.item-icon {
  width: 28px;
  height: 28px;
  img {
    width: 100%;
  }
}
.warn-icon {
  width: 70px;
  height: 70px;
  margin-top: 28px;
  margin-bottom: 16px;
  img {
    width: 100%;
  }
}
.van-dialog {
  width: 280px;
}
</style>
<style lang="scss">
.mine {
  .swiper-container-horizontal > .swiper-pagination-bullets,
  .swiper-pagination-custom,
  .swiper-pagination-fraction {
    bottom: 10px;
    right: 57px;
    left: unset;
    width: auto;
    display: flex;
    align-items: center;
  }
  .swiper-pagination-bullet {
    width: 6px;
    height: 6px;
  }
  .swiper-container-horizontal
    > .swiper-pagination-bullets
    .swiper-pagination-bullet {
    margin: 0 2px;
  }
  .swiper-pagination-bullet-active {
    background: #ff7ac8;
    width: 8px;
    height: 8px;
  }
  .van-swipe__indicators {
    right: 57px;
    display: flex;
    align-items: center;
  }
  .van-swipe__indicator--active {
    width: 8px;
    height: 8px;
  }
  .van-nav-bar__right .van-icon {
    font-size: 24px;
  }
  .van-dialog__confirm,
  .van-dialog__confirm:active {
    color: rgba(159, 74, 242, 1);
  }
}
</style>
