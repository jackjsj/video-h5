<template>
  <div class="bg flex-col">
    <van-nav-bar
      class="flex-none"
      title="漫画"
      left-text="书架"
      :border="false"
      @click-left="$router.push('/myCaricature')">
      <van-icon name="search" slot="right" color="#fff"
        @click="$router.push('/caricatureSearch')" />
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
        @load="getCartoonInfo">
        <div class="list flex flex-wrap jcb flex-auto ova"
          style="align-content:flex-start;">
          <div
            class="item mb15"
            v-for="item in list"
            :key="item.id"
            @click="$router.push(`/caricatureDetails/${item.id}`)">
            <div class="img-wrapper rel flex aic jcc">
              <div style="height:100%;width:100%;" class="flex jcc">
                <van-image :src="item.cover" />
              </div>
              <div class="num abs fw400">共{{item.chapterNum}}话</div>
              <div class="status abs fw400">{{item.status}}</div>
            </div>
            <p class="cb9 item-name">
              <span class="movie-name">{{item.name}}</span>
            </p>
          </div>
          <div class="item-pad"></div>
          <div class="item-pad"></div>
        </div>
      </van-list>

    </div>
    <van-overlay :show="overlayVisible" />
  </div>
</template>

<script>
import { getCartoonInfo } from '@/api';

const states = [
  {
    name: '全部',
    id: undefined,
  },
  {
    name: '连载中',
    id: '连载中',
  },
  {
    name: '已完结',
    id: '已完结',
  },
];

export default {
  name: 'Bannel',
  data() {
    return {
      orderTypes: [],
      classifyList: [],
      caricatureList: [],
      classifyIndex: 0, // 选中的是哪一个
      orderTypeIndex: 0,

      list: [],
      orders: [],
      states,
      types: [],
      currentState: {
        name: '全部',
        id: undefined,
      },
      currentOrder: {},
      currentType: {},
      overlayVisible: false,
      pageNum: 1,
      classifyId: '-1',
      orderType: '0',
      loading: false,
      finished: false,
      error: false,
    };
  },
  mounted() {
    this.getCartoonInfo();
  },
  methods: {
    onFilterBtnClick(item, target) {
      console.log(item, target);
      this[target] = item;
      this.classifyId = this.currentType.id;
      this.orderType = this.currentOrder.type;
      this.pageNum = 1;
      this.finished = false;
      this.getCartoonInfo();
    },
    // 路由跳转
    goto(path) {
      this.$router.push(path);
    },
    // 跳转详情页面
    toDetailsPage(id) {
      this.$router.push(`caricatureDetails/${id}`);
    },
    async getCartoonInfo() {
      // this.overlayVisible = true;
      // Toast.loading({
      //   message: '加载中...',
      //   loadingType: 'spinner',
      //   duration: 0,
      // });
      const { pageNum } = this;
      const result = await getCartoonInfo({
        classifyId: this.classifyId,
        orderType: this.orderType,
        status: this.currentState.id,
        pageNum: this.pageNum,
        pageSize: 30,
      });
      if (result.retCode === '1') {
        const { data } = result;
        this.types = data.classifyList;
        this.orders = data.orderTypes;
        this.currentOrder = this.orders.filter(
          item => item.type === Number(data.orderType),
        )[0];
        this.currentType = this.types.filter(
          item => item.id === Number(data.classifyId),
        )[0];
        this.loading = false;
        if (pageNum === 1) {
          this.list = data.caricatureList;
        } else {
          this.list.push(...data.caricatureList);
        }
        if (data.caricatureList.length < 30) {
          // 说明全部加载完了
          this.finished = true;
        } else {
          // 说明还有数据
          this.pageNum++;
        }
        // Toast.clear();
        // this.overlayVisible = false;
      } else {
        // Toast.clear();
        // this.overlayVisible = false;
        Toast('出错了');
      }
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
