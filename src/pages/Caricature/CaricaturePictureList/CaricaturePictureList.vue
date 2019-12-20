<template>
  <div class="bg-2 flex-col vh100 setting">
    <van-nav-bar
      class="flex-none bgwh1"
      :title="chapterName"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="flex-auto ova" ref="scrollBox">
      <div v-for="item in chapterPictureList"
        :key="item.sortNo">
        <div class="flex jcc">
          <van-image class="pct100" :src="item.imgUrl" />
        </div>
      </div>
    </div>
    <div class="flex-none flex aic btn-group wh f14">
      <p class="flex1 tc btn-item"
        style="border-right:1px solid rgba(255,255,255,.2)"
        @click="getChapterPictureList(upId)">上一章</p>
      <p class="flex1 tc btn-item"
        @click="getChapterPictureList(nextId)">下一章</p>
    </div>
  </div>
</template>

<script>
import { getChapterPictureList } from '@/api';

export default {
  name: 'CaricaturePictureList',
  data() {
    return {
      chapterId: null, // 章节id
      chapterPictureList: [], // 图片列表
      chapterName: '', // 章节名字
      upId: -1, // 上一章
      nextId: -1, // 下一章
    };
  },
  mounted() {
    const { chapterId } = this.$route.params;
    this.chapterId = chapterId;
    this.getChapterPictureList(this.chapterId);
  },
  methods: {
    async getChapterPictureList(chapterId) {
      // 如果章节id为-1则表示无上一章
      if (chapterId === -1) {
        Toast('无更多数据');
        return;
      }
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const result = await getChapterPictureList(chapterId);
      if (result.retCode === '1') {
        this.chapterName = result.data.caricatureChapterMap.NAME;
        this.chapterPictureList =
          result.data.caricatureChapterMap.chapterImgList;
        this.upId = result.data.caricatureChapterMap.upId;
        this.nextId = result.data.caricatureChapterMap.nextId;
        this.$refs.scrollBox.scrollTop = 0;
        Toast.clear();
      } else {
        Toast({
          message: result.retMsg,
          onClose: () => {
            this.$router.back();
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  height: 50px;
  background: rgba(27, 24, 46, 1);
}
</style>
