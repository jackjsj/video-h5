<template>
  <!-- 积分详情 -->
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none bgwh1"
      title="积分详情"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="pl20 pr20">
      <div
        class="record wh flex-col jcc"
        v-for="(item,index) in records"
        :key="index">
        <p class="f14 fw400 mb5">{{item.name}} +{{item.number}}</p>
        <p class="opa5 fw400">{{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getHistoryRecord } from '@/api';

export default {
  data() {
    return {
      records: [],
      moment,
    };
  },
  mounted() {
    getHistoryRecord().then(resp => {
      console.log(resp);
      this.records = resp.data;
    });
  },
};
</script>

<style lang="scss" scoped>
.record {
  height: 66px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
</style>
