<template>
  <!-- 小说内容 -->
  <div class="bg-2 flex-col vh100 setting">
    <van-nav-bar
      class="flex-none bgwh1"
      :title="name"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="flex-auto ova p15" ref="scrollBox">
      <p class="context" v-html="context"></p>
    </div>
    <div class="flex-none flex aic btn-group wh f14">
      <p class="flex1 tc btn-item"
        style="border-right:1px solid rgba(255,255,255,.2)"
        @click="getChapterDetail(upId)">上一章</p>
      <p class="flex1 tc btn-item"
        @click="getChapterDetail(nextId)">下一章</p>
    </div>
  </div>
</template>

<script>
import { getChapterDetail } from '@/api';
export default {
  data() {
    return {
      id: null, // 章节id
      context: '', // 图片列表
      name: '', // 章节名字
      upId: -1, // 上一章
      nextId: -1, // 下一章
    };
  },
  mounted() {
    const chapterId = this.$route.query.id;
    this.getChapterDetail(chapterId);
  },
  methods: {
    getChapterDetail(chapterId) {
      if (chapterId === -1) {
        Toast('无更多数据');
        return;
      }
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      getChapterDetail({
        chapterId,
      }).then(resp => {
        if (resp.retCode === '1') {
          this.$refs.scrollBox.scrollTop = 0;
          const {
            data: { caricatureChapterMap },
          } = resp;
          Object.assign(this, caricatureChapterMap);
          Toast.clear();
        } else {
          Toast({
            message: resp.retMsg || resp.msg,
            onClose: () => {
              this.$router.back();
            },
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  height: 50px;
  background: rgba(27, 24, 46, 1);
}
.context {
  font-size: 15px;
  font-weight: 400;
  color: #fff;
  line-height: 24px;
}
</style>
