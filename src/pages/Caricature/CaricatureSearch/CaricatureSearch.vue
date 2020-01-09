<template>
  <div class="bg-2 flex-col vh100 history">
    <div class="flex aic jcb pl15 pr15 flex-none pt10 mb5">
      <van-search ref="searchInput" placeholder="输入关键词搜索片源" v-model="searchName"
        background="transparent"
        class="search-bar flex-auto"
        shape="round"
        left-icon="search"
        @search="search"
        @clear="clearData" />
      <p class="ml8 wh f14 fw400 opa7"
        @click="$router.back()">取消</p>
    </div>
    <div class="ova flex-auto">
      <!-- 热门搜索 -->
      <div class="wh p20"
        v-show="searchDataList.length=== 0">
        <p class="f18 fw500 mb10">热门搜索</p>
        <div class="flex flex-wrap ">
          <p
            class="tag-item mr8 mb8"
            v-for="(item,index) in hotLabels"
            :key="index"
            @click="search(item)">
            {{item}}
          </p>
        </div>
      </div>
      <!-- 搜索结果 -->
      <div>
        <div
          class="flex-col rel result-item"
          v-for="item in searchDataList"
          :key="item.id"
          @click="$router.push(`/caricatureDetails/${id}`)">
          <div class="flex-auto cover-img-wrapper flex jcc">
            <van-image :src="item.cover" />
          </div>
          <p class="result-name wh flex-none f16 fw600">
            <span class="van-multi-ellipsis--l2 mt5">{{item.name}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <van-overlay :show="overlayVisible" />
  </div>
</template>

<script>
import { getCaricatureHotLabel, getCartoonInfo } from '@/api';

export default {
  data() {
    return {
      hotLabels: [],
      isSearch: false,
      searchName: '', // 搜索名称
      searchDataList: [], // 搜索数据
      overlayVisible: false,
    };
  },
  mounted() {
    this.$nextTick().then(() => {
      const { type } = this.$route.params;
      this.type = type;
      // document.getElementsByTagName('input')[0].focus();
      this.getHotLabel();
    });
  },
  methods: {
    // 处理搜索点击跳转
    handleSearchSkip(id) {
      this.$router.push(`/video/${id}`);
    },
    clearData() {
      this.searchName = '';
      this.searchDataList = [];
    },
    // 搜索
    async search(searchName) {
      if (searchName) {
        this.searchName = searchName;
      }
      if (this.searchName) {
        this.overlayVisible = true;
        Toast.loading({
          message: '加载中...',
          loadingType: 'spinner',
          duration: 0,
        });
        const result = await getCartoonInfo({ searchName: this.searchName });
        if (result.retCode === '1') {
          this.searchDataList = result.data.caricatureList;
        } else {
          Toast(result.retMsg);
        }
        Toast.clear();
        this.overlayVisible = false;
      } else {
        Toast('请输入搜索内容');
      }
    },
    // 获取热词
    async getHotLabel() {
      const result = await getCaricatureHotLabel();
      if (result.retCode === '1') {
        this.hotLabels = result.data.searchNameList;
      } else {
        Toast(result.retMsg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.van-search {
  padding: 0;
}
.tag-item {
  background: rgba(0, 0, 0, 0.2);
  line-height: 1;
  padding: 6px 8px;
  border-radius: 4px;
}
.result-item {
  margin: 15px;
  height: 239px;
  box-sizing: border-box;
}
.cover-img-wrapper {
  border-radius: 9px 9px 0 0;
  background: rgba(255, 255, 255, 0.1);
}
.result-name {
  border-radius: 0 0 9px 9px;
  height: 45px;
  line-height: 18px;
  padding: 0 13px;
  background: rgba(27, 24, 46, 1);
}
</style>
<style lang="scss">
.van-icon-search {
  color: #fff;
  opacity: 0.7;
}
</style>
