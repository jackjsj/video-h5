<template>
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none bgwh1"
      title="章节"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="pl20 pr20 flex-auto ova">
      <div
        class="record wh flex-col jcc"
        v-for="(item,index) in chapterList"
        :key="index"
        @click="toCaricaturePicturePage(item.id)">
        <p class="f14 fw400 mb5">{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaricatureChapterInfo } from '@/api';

export default {
  data() {
    return {
      id: null,
      chapterList: [],
    };
  },
  mounted() {
    // 获取参数
    const { id } = this.$route.params;
    this.id = id;

    this.getCaricatureChapterInfo();
  },
  methods: {
    // 跳转漫画详情页面
    toCaricaturePicturePage(id) {
      this.$router.push(`/caricaturePictureList/${id}`);
    },
    async getCaricatureChapterInfo() {
      const result = await getCaricatureChapterInfo(this.id);
      console.log(result);
      if (result.retCode === '1') {
        console.log(result);
        this.chapterList = result.data.chapterMapList;
      } else {
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
}
</style>
