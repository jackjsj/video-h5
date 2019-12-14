<template>
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none"
      title="积分管理"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="flex-auto ova">
      <!-- 卡 -->
      <div class="card">
        <p class="mc-gold f18 fw500 mb18">尊享VIP无限观影</p>
        <div class="flex aic wh">
          <!-- 头像 -->
          <div class="avatar flex-none flex jcc mr5">
            <van-image fit="cover" :src="memberInfo.headpic ? memberInfo.headpic : defaultAvatar" />
          </div>
          <div class="flex-auto lh1">
            <p class="f17 fw400 mb5">{{memberInfo.nickName}}</p>
            <div class="flex aic">
              <p class="flex1 g9">{{isVip === 0?'尚未':'已'}}开通VIP</p>
              <p class="flex flex1 aic">
                <span class="f14 mr5">{{integralNumber}}</span>
                <span class="g9">积分详情</span>
                <van-icon class="g9" name="arrow" />
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- tabs -->
      <div class="vip-bg">
        <van-tabs v-model="active"
          :border="false"
          title-active-color="#fff"
          title-inactive-color="#A7ADB6"
          @click="onTabClick">
          <van-tab title="获取积分">
            <div class="wh">
              <div
                class="flex jcb aic ia-item"
                style="border-width:1px;"
                v-for="item in integralClassifies"
                :key="item.title">
                <div>
                  <p class="f14 fw400">{{item.name}} +{{item.number}}</p>
                  <p class="opa5">{{item.integral_desc}}</p>
                </div>
                <div>
                  <button class="btn"
                    :class="{finished:item.isAccomplish}"
                    @click="finishTask(item)">{{item.isAccomplish?'已完成':'去完成'}}</button>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="积分兑换">
            <div class="wh">
              <div
                class="flex jcb aic ia-item"
                style="border-width:1px;"
                v-for="item in exchangeVipTypes"
                :key="item.title">
                <div>
                  <p class="f14 fw400">{{item.dayNumber}}天VIP特权</p>
                  <p class="opa5">{{item.integralNumber}}积分即可兑换{{item.dayNumber}}天VIP特权</p>
                </div>
                <div>
                  <button class="btn">去兑换</button>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab disabled>
            <template #title>
              <span @click="$router.push('/vipCreditAdd')">购买VIP</span>
            </template>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getIntegralClassifies,
  getExchangeVipTypes,
  checkInAddIntegral,
} from '@/api';

const integralAcquireItems = [
  {
    title: '每日签到  +20',
    desc: '每天登录APP点击签到，即可获得积分',
    finished: false,
  },
  {
    title: '保存二维码  +20',
    desc: '打开分享界面保存推广二维码',
    finished: false,
  },
  {
    title: '点击广告  +50',
    desc: '每天首次点击APP任意广告，可获得积分',
    finished: true,
  },
  {
    title: '下载APP  +100',
    desc: '下载并打开APP，可获得积分，仅限一次',
    finished: false,
  },
  {
    title: '推广新用户  +200',
    desc: '推广新用户，可获得积分',
    finished: false,
  },
];

const integralExchangeItems = [
  {
    title: '1天VIP特权',
    desc: '1积分即可兑换1天VIP特权',
    finished: false,
  },
];

export default {
  data() {
    return {
      showType: 1, // 1显示获取积分分类， 2: 会员积分兑换
      width: screen.availWidth,
      height: screen.availHeight,
      isVip: 0, // 是否是会员
      integralNumber: 0, //积分数
      headHeight: null,
      integralClassifies: [], // 积分兑换类型
      exchangeVipTypes: [],
      payTypes: [],
      cardTypes: [],
      userId: 0,
      //
      memberInfo: {},
      defaultAvatar: require('@/assets/images/avatar.png'),
      active: 0,
    };
  },
  mounted() {
    this.memberInfo = JSON.parse(localStorage.getItem('memberInfo')) || {};
    this.getIntegralClassifies();
    // this.getExchangeVipTypes();
    this.showType = parseInt(this.$route.params.showType);
    this.userId = this.$store.state.userId;
  },
  methods: {
    updateVipState(isVip) {
      this.isVip = isVip;
    },
    onTabClick(name) {
      switch (name) {
        case 0:
          this.getIntegralClassifies();
          break;
        case 1:
          this.getExchangeVipTypes();
          break;
        case 2:
          this.active = 0;
          this.$router.push('/vipCreditAdd');
          break;
      }
    },
    // 获取积分获取项
    async getIntegralClassifies() {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
      });
      const result = await getIntegralClassifies();
      if (result.retCode === '1') {
        this.integralClassifies = result.integralClassifyList;
        this.isVip = result.isVip;
        this.integralNumber = result.integralNumber;
        Toast.clear();
      } else {
        Toast(result.retMsg);
        this.$router.push('/personalCenter');
      }
    },
    async getExchangeVipTypes() {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
      });
      const result = await getExchangeVipTypes();
      if (result.retCode === '1') {
        this.exchangeVipTypes = result.data.integralVipList;
        Toast.clear();
      } else {
        Toast(result.retMsg);
        this.$router.push('/personalCenter');
      }
    },
    // 完成任务
    finishTask(item) {
      const { id, isAccomplish } = item;
      if (isAccomplish) {
        return;
      }
      switch (id) {
        case 1:
          this.addIntegral(id);
          break;
        /*跳转路由邀请好友*/
        case 2:
          this.$router.push('/invitation');
          break;
        /*跳转到首页*/
        case 3:
          this.$router.push('/home');
          break;
        /*跳转到下载链接*/
        case 4:
          window.location.href = 'https://qqsp.app/';
          break;
        /*跳转路由邀请好友*/
        case 5:
          this.$router.push('/invitation');
          break;
        /*登录*/
        case 6:
          this.$router.push('/login');
          break;
        case 7:
          this.addIntegral(id);
          break;
      }
    },

    // 添加积分
    async addIntegral(id) {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
      });
      const result = await checkInAddIntegral(id);
      if (result.retCode === '1') {
        Toast('任务完成');
        this.getIntegralClassifies();
      } else {
        Toast('任务失败:' + result.retMsg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  margin: 20px 15px;
  height: 194px;
  background: rgba(27, 24, 46, 1);
  border-radius: 9px;
  padding: 20px;
  box-sizing: border-box;
}
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
}
.mc-gold {
  color: #cfae98;
}
.vip-bg {
  background: url(~@/assets/images/vip-bg.png);
  background-size: cover;
  height: 449px;
  margin-top: -70px;
  padding: 20px;
}
.ia-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 13px 0;
  &:last-child {
    border: 0;
  }
}
.btn {
  width: 80px;
  height: 35px;
  border-radius: 35px;
  border: none;
  background: linear-gradient(#e95aa0, #a769ff);
  &.finished {
    background: #999999;
  }
  &:active {
    opacity: 0.7;
  }
}
</style>
<style lang="scss">
.vip-info-detail {
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
    width: 76px !important;
  }
  .van-tabs__wrap {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    // margin-bottom: 20px;
  }
}
</style>
