<template>
  <!-- 离线缓存 -->
  <div class="bg-2 flex-col vh100 history">
    <van-nav-bar
      class="flex-none bgwh1"
      title="我的喜欢"
      left-arrow
      :right-text="editing?'完成':'编辑'"
      :border="false"
      @click-left="$router.back()"
      @click-right="onRightClick()">
    </van-nav-bar>
    <div class="records flex-auto ova" v-if="movies.length>0">
      <div
        class="item flex aic mb15"
        v-for="item in movies"
        :key="item.id">
        <van-checkbox
          v-show="editing"
          v-model="item.checked"
          checked-color="#B000BA"
          class="mr18 flex-none">
        </van-checkbox>
        <div class="pct100 flex aic flex-none"
          @click="$router.push(`/video/${item.videoId}`)">
          <div class="item-cover flex jcc mr13 flex-none ovh">
            <van-image
              :src="item.videoCover" />
            <div class="abs cover-logo flex jcc" v-if="item.logoCover">
              <van-image :src="item.logoCover" />
            </div>
            <p class="abs movie-duration" v-if="item.duration">{{item.duration}}</p>
          </div>
          <div class="flex-col jca">
            <p class="wh f16 opa9 fw500 lh23 van-multi-ellipsis--l2">{{item.videoName}}</p>
            <p class="f12 wh opa5 fw400">{{item.viewTime}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 无记录 -->
    <div class="flex-auto ova flex-col aic" v-else>
      <div class="no-cache-img flex jcc">
        <img src="@/assets/images/暂无记录.png" />
      </div>
      <p class="g9 f15 fw400 mt10">暂无记录</p>
    </div>
    <div class="ctrl-bar flex-none wh flex aic f15 fw400" v-show="editing">
      <div class="flex aic flex1 jcc ctrl-bar-item"
        @click="selectAll"
        style="background:#272727">
        <van-icon name="passed" color="#fff" />
        <p class="ml5">{{!allSelect ? '全选':'全不选'}}</p>
      </div>
      <div class="flex aic flex1 jcc ctrl-bar-item"
        @click="deleteSelected">
        <van-icon name="delete" color="#fff" />
        <p class="ml5">删除</p>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteCareHistory, getMemberCareHistoryPage } from '@/api';

const records = new Array(10).fill().map((item, index) => ({
  videoCover: '',
  videoName: '动物管理局静林宝可梦：大家的故事的时尚',
  viewTime: '2019-11-30',
  id: index,
}));
export default {
  data() {
    return {
      editing: false,
      movies: [],
      allSelect: false,
    };
  },
  mounted() {
    this.getMemberCareHistoryPage();
  },
  methods: {
    async getMemberCareHistoryPage() {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
        forbidClick: true,
      });
      const result = await getMemberCareHistoryPage();
      if (result.retCode === '1') {
        this.movies = result.data;
        Toast.clear();
      } else {
        Toast('加载失败');
      }
    },
    onRightClick() {
      this.editing = !this.editing;
    },
    selectAll() {
      this.allSelect = !this.allSelect;
      this.movies.forEach(item => (item.checked = this.allSelect));
    },
    async deleteSelected() {
      const selected = this.movies.filter(item => item.checked);
      if (selected.length === 0) {
        return;
      }
      const ids = selected.map(item => item.id).join(',');
      Toast.loading({
        message: '正在删除...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
        forbidClick: true,
      });
      const result = await deleteCareHistory({
        ids,
      });
      if (result.retCode === '1') {
        Toast.clear();
        this.getMemberCareHistoryPage();
      } else {
        Toast(result.retMsg);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.records {
  padding: 15px;
  padding-right: 0;
}
.item {
  overflow: hidden;
}
.item-cover {
  width: 126px;
  height: 71px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}
.lh23 {
  line-height: 23px;
}
.ctrl-bar-item {
  height: 64px;
  background: rgba(22, 22, 22, 1);
  &:active {
    opacity: 0.7;
  }
}
.no-cache-img {
  width: 161px;
  height: 163px;
  margin-top: 113px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang="scss">
.history {
  .van-nav-bar__text {
    font-size: 14px;
  }
}
</style>
