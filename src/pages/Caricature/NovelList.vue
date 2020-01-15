<template>
  <!-- 小说列表 -->
  <div class="bg flex-col vh100 novel-list">
    <van-nav-bar
      class="flex-none"
      title="小说"
      left-arrow
      right-text=""
      :border="false"
      @click-right="$router.push('/myCaricature')"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="content flex-col flex-auto ova">
      <div class="ctrl-bar flex-none mb10">
        <div class="flex ova">
          <div
            style="border-width:1px;"
            class="filter-btn"
            :class="{active:item.name === currentOrder.name}"
            v-for="item in orders"
            :key="item.name"
            @click="onFilterBtnClick(item,'currentOrder')">{{item.name}}</div>
        </div>
        <div class="flex ova">
          <div
            style="border-width:1px;"
            class="filter-btn"
            :class="{active:item.name === currentState.name}"
            v-for="item in states"
            :key="item.name"
            @click="onFilterBtnClick(item,'currentState')">{{item.name}}</div>
        </div>
        <div class="flex ova">
          <div
            style="border-width:1px;"
            class="filter-btn"
            :class="{active:item.name === currentType.name}"
            v-for="item in types"
            :key="item.id"
            @click="onFilterBtnClick(item,'currentType')">{{item.name}}</div>
        </div>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        finished-text="没有更多了"
        @load="getMore">
        <div class="list flex flex-wrap jcb flex-auto ova"
          style="align-content:flex-start;">
          <div
            class="item mb15"
            v-for="item in list"
            :key="item.id"
            @click="$router.push(`/novelChapters?id=${item.id}`)">
            <div class="img-wrapper rel flex aic jcc">
              <div style="height:100%;width:100%;" class="flex jcc">
                <van-image :src="item.cover" />
              </div>
              <div class="num abs fw400">共{{item.chapterNum || 0}}话</div>
              <div class="status abs fw400">{{item.status}}</div>
            </div>
            <p class="cb9 item-name">
              <span class="movie-name">{{item.NAME}}</span>
            </p>
          </div>
          <div class="item-pad"></div>
          <div class="item-pad"></div>
        </div>
      </van-list>

    </div>
  </div>
</template>

<script>
import { getNovelInfo } from '@/api';

export default {
  data() {
    return {
      list: [],
      orders: [],
      states: [],
      types: [],
      currentState: {},
      currentOrder: {},
      currentType: {},
      loading: false,
      finished: false,
      error: false,
      pageNum: 1,
      pageSize: 30,
    };
  },
  mounted() {
    this.getNovels({}, true);
  },
  methods: {
    getMore() {
      this.getNovels();
    },
    /**
     * 获取筛选方式数据,同时获取初始数据
     */
    async getNovels(options = {}, isInit = false) {
      isInit &&
        Toast.loading({
          message: '加载中...',
          loadingType: 'spinner',
          duration: 0,
        });
      const {
        pageNum,
        currentType,
        currentOrder,
        currentState,
        pageSize,
      } = this;
      const resp = await getNovelInfo({
        pageNum,
        classifyId: currentType.id,
        orderType: currentOrder.type,
        status: currentState.type,
        pageSize,
        ...options,
      });
      if (resp.retCode === '1') {
        const { data } = resp;
        const { novelList } = data;
        this.loading = false;
        if (isInit) {
          this.orders = data.orderTypes;
          this.states = data.novelStatusTypes;
          this.types = data.classifyList;
          [this.currentOrder] = this.orders;
          [this.currentType] = this.types;
          [this.currentState] = this.states;
        }
        if (pageNum === 1) {
          this.list = novelList;
        } else {
          this.list.push(...novelList);
        }
        if (novelList.length < this.pageSize) {
          this.finished = true;
        } else {
          this.pageNum++;
        }
        Toast.clear();
      } else {
        Toast(resp.retMsg || resp.msg);
      }
    },
    onFilterBtnClick(item, target) {
      console.log({ item, target });
      this[target] = item;
      this.pageNum = 1;
      this.finished = false;
      this.list = [];
      this.getNovels();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 15px;
}
.filter-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 5px 13px;
  margin-right: 10px;
  margin-bottom: 10px;
  color: #fff;
  font-size: 14px;
  flex: none;
  box-sizing: border-box;
  &.active {
    border-color: rgba(255, 255, 255, 0);
    background: linear-gradient(#e95aa0, #a769ff);
    box-sizing: border-box;
  }
}
.img-wrapper {
  width: 108px;
  height: 152px;
  background: rgba(204, 204, 204, 0.1);
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  .num {
    left: 4px;
    top: 4px;
    color: #fff;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    padding: 2px 4px;
  }
  .status {
    right: 4px;
    bottom: 4px;
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
    padding: 2px 4px;
    border-radius: 4px;
  }
}
.item-pad {
  width: 108px;
}
.item-name {
  background: #161616;
  height: 34px;
  line-height: 34px;
  padding: 0 6px;
  width: 108px;
  border-radius: 0 0 4px 4px;
  box-sizing: border-box;
}
</style>
