<template>
  <div class="bg flex-col mine">
    <van-nav-bar
      class="flex-none"
      :border="false">
      <van-icon name="setting-o" slot="right" />
    </van-nav-bar>
    <div class="flex-auto ova content">
      <!-- 用户信息 -->
      <div class="flex-col aic">
        <img class="avatar" src="@/assets/images/avatar.png" />
        <p class="username f20 fw400 wh">游客</p>
        <div class="flex pct100 jcb g9 mt20">
          <div class="flex-col flex1 jcb aic user-info-item">
            <div class="flex aic wh">
              <img class="integral-icon" src="@/assets/images/积分.png" />
              <span class="f12 mr10 ml10">X</span>
              <span class="f24">0</span>
            </div>
            <p>我的积分</p>
          </div>
          <div class="flex-col flex1 jcb aic user-info-item">
            <button class="user-info-btn wh"
              style="border-width:1px;">积分详情</button>
            <p>积分可兑换会员</p>
          </div>
          <div class="flex-col flex1 jcb aic user-info-item">
            <button class="user-info-btn yellow"
              style="border-width:1px;">签到</button>
            <p>每日签到</p>
          </div>
        </div>
      </div>
      <!-- 会员中心 -->
      <div class="mt30">
        <p class="wh f16 fw400 pl20">会员中心</p>
        <div class="bar rel">
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
          <p class="wh f24">{{item.count}}</p>
          <p class="g9 f12 ">{{item.name}}</p>
        </div>
      </div>
      <!-- swiper -->
      <div>
        <div class="swiper-wrapper">
          <van-swipe
            :autoplay="3000"
            :width="300"
            indicator-color="#FF7AC8">
            <van-swipe-item v-for="item in 3"
              :key="item">
              <div class="swiper-item">
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 功能列表 -->
      <div class="flex flex-wrap mt30 mb30">
        <div
          class="flex-col aic item jcb g9"
          v-for="item in items"
          :key="item.name">
          <div class="item-icon flex aic jcc mb10">
            <img :src="item.icon" />
          </div>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const countItems = [
  {
    name: '今日观影次数',
    count: 2,
  },
  {
    name: '小视频次数',
    count: 6,
  },
  {
    name: '下载',
    count: 0,
  },
];
const items = [
  {
    name: '会员充值',
    icon: require('@/assets/images/会员充值.png'),
  },
  {
    name: '积分管理',
    icon: require('@/assets/images/积分管理.png'),
  },
  {
    name: '邀请好友',
    icon: require('@/assets/images/邀请好友.png'),
  },
  {
    name: '我的收藏',
    icon: require('@/assets/images/我的收藏.png'),
  },
  {
    name: '观看记录',
    icon: require('@/assets/images/观看记录.png'),
  },
  {
    name: '下载记录',
    icon: require('@/assets/images/下载记录.png'),
  },
  {
    name: '火爆交流群',
    icon: require('@/assets/images/火爆交流群.png'),
  },
  {
    name: '联系客服',
    icon: require('@/assets/images/联系客服.png'),
  },
  {
    name: '手势密码',
    icon: require('@/assets/images/手势密码.png'),
  },
];
export default {
  data() {
    return {
      countItems,
      items,
    };
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
  margin: auto;
}
.van-swipe-item {
  width: 289px;
}
.van-swipe {
  padding-left: 43px;
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
  &:active{
    opacity: .7;
  }
}
.item-icon {
  width: 28px;
  height: 28px;
  img {
    width: 100%;
  }
}
</style>
<style lang="scss">
.mine {
  .van-swipe__indicators {
    right: 57px;
    display: flex;
    align-items: center;
  }
  .van-swipe__indicator--active {
    width: 8px;
    height: 8px;
  }
  .van-nav-bar__right .van-icon{
    font-size:24px;
  }
}
</style>
