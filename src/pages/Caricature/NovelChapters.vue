<template>
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none bgwh1"
      title="小说章数"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="pl20 pr20 flex-auto ova">
      <div
        class="record wh flex-col jcc"
        v-for="(item,index) in chapterList"
        :key="index"
        @click="$router.push(`/novelContent?id=${item.id}`)">
        <p class="f14 fw400 mb5">{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getNovelChapters } from '@/api';

export default {
  data() {
    return {
      chapterList: [],
    };
  },
  mounted() {
    const novelId = this.$route.query.id;
    Toast.loading({
      message: '加载中...',
      loadingType: 'spinner',
      duration: 0,
    });
    getNovelChapters({
      novelId,
    }).then(resp => {
      if (resp.retCode === '1') {
        this.chapterList = resp.data.chapterMapList;
        Toast.clear();
      } else {
        Toast(resp.retMsg || resp.msg);
      }
    });
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
}
</style>
