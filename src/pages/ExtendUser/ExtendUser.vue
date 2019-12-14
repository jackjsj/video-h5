<template>
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none bgwh1"
      title="我的推广"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="flex-auto wh p15 flex-col ova">
      <div class="flex aic f16 mb10 flex-none">
        <div class="flex1 tc"><span>用户名</span></div>
        <div class="flex1 tc"><span>手机号</span></div>
        <div class="flex1 tc"><span>注册时间</span></div>
      </div>
      <div class="flex-auto ova">
        <div class="flex aic f14 record"
          style="border-width:1px;"
          v-for="(item,index) in extensions" :key="index">
          <div class="flex1 tc"><span>{{item.nickName}}</span></div>
          <div class="flex1 tc"><span>{{item.tel}}</span></div>
          <div class="flex1 tc"><span>{{item.regeditTime}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExtensionHistory } from '@/api';

export default {
  name: 'ExtendUser',
  data() {
    return {
      extensions: [],
    };
  },
  mounted() {
    this.getExtensionHistory();
  },
  methods: {
    async getExtensionHistory() {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true,
        overlay: true,
      });
      const result = await getExtensionHistory();
      if (result.retCode === '1') {
        this.extensions = result.data;
        Toast.clear();
      } else {
        Toast(result.retMsg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.record {
  height: 66px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  &:active {
    opacity: 0.7;
  }
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
