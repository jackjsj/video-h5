<template>
  <div class="bg-2 flex-col vh100">
    <van-nav-bar
      class="flex-none"
      title="我的书架"
      left-arrow
      right-text="记录"
      @click-left="$router.back()"
      :border="false">
    </van-nav-bar>
    <div class="flex-auto ova p15">
      <div class="list flex flex-wrap jcb flex-auto ova">
        <div
          class="item mb15"
          v-for="item in caricatures"
          :key="item.id">
          <div class="img-wrapper rel flex aic jcc">
            <van-image fit="contain" :src="item.cover" />
            <div class="num abs fw400">共{{item.chapterNum}}话</div>
            <!-- <div class="status abs fw400">{{item.status}}</div> -->
          </div>
          <p class="cb9 item-name ">
            <span class="movie-name">{{item.caricatureName}}</span>
          </p>
        </div>
        <div class="item-pad"></div>
        <div class="item-pad"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaricatureBookcaseList, delCaricatureBookcase } from '../../../api';

const list = new Array(10).fill().map((item, index) => ({
  name: '我的英雄学院',
  status: '连载中',
  chapterNum: '25',
  cover: '',
  id: index,
}));

export default {
  data() {
    return {
      isSelect: false,
      leftPer: 0,
      midPer: 1 / 2,
      rightPer: 1 / 2,
      menu: '编辑',
      bottomMenu1: '全选',
      myAllSelect: false,
      radio001: 'a',
      deleteItem: [],
      deleteItemFlag: false,
      caricatures: [],
      showToast: false,
      showToastMsg: '',
    };
  },
  mounted() {
    this.getCaricatureBookcaseList({});
  },
  methods: {
    async getCaricatureBookcaseList(params) {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
      });
      const result = await getCaricatureBookcaseList(params);
      if (result.retCode === '1') {
        this.caricatures = result.data.caricatureBookcaseList;
        Toast.clear();
      } else {
        Toast('加载失败');
      }
    },
    showSelect() {
      this.isSelect = !this.isSelect;

      if (this.isSelect) {
        this.leftPer = 1 / 7;
        this.midPer = 3 / 7;
        this.rightPer = 3 / 7;
        this.menu = '完成';
      } else {
        this.menu = '编辑';
        this.leftPer = 0;
        this.midPer = 1 / 2;
        this.rightPer = 1 / 2;
        this.myAllSelect = false;
        this.deleteItem = [];
        this.bottomMenu1 = '全选';
      }
    },
    selectAll() {
      this.myAllSelect = !this.myAllSelect;

      if (this.myAllSelect) {
        this.bottomMenu1 = '取消全选';
      } else {
        this.bottomMenu1 = '全选';
      }
      console.log('全选');
    },
    async deleteSelected() {
      // 点击删除
      let ids = new Array(); // 创建list集合
      // 如果全选时删除
      if (this.myAllSelect) {
        this.caricatures.forEach(caricature => {
          ids.push(caricature.caricatureId);
        });
      } else {
        this.deleteItem.forEach(value => {
          ids.push(value);
        });
      }

      console.log(this.myAllSelect);
      console.log(this.deleteItem.length);
      console.log(ids.length);

      /*
           不拦截
            全选
            没有全选时选中>0
        */

      if (
        !(this.myAllSelect || (!this.myAllSelect && this.deleteItem.length > 0))
      ) {
        // 提示请选择要删除
        this.showToastMsg = '请选择';
        this.showToast = true;
        return;
      }

      const params = ids;
      this.$vux.loading.show({
        text: '删除中',
      });
      const result = await delCaricatureBookcase(params);
      if (result.retCode === '1') {
        this.$vux.loading.hide();
        this.showToastMsg = `删除了${ids.length}条记录`;
        /*this.showToastMsg = '删除了选择的记录' */
        this.showToast = true;
        this.getCaricatureBookcaseList();

        // 强制刷新页面
        // this.$forceUpdate();
        // location.reload()
        /* this.$router.go(0)*/
      } else {
        this.$vux.loading.hide();
        this.showToastMsg = '删除失败';
        this.showToast = true;
      }
    },
    selectDelItem(id) {
      // 选择单个删除
      // 如果已经存在删除
      let isContains = false;

      for (let i = 0; i < this.deleteItem.length; i++) {
        if (this.deleteItem[i] === id) {
          this.deleteItem.splice(i, 1);
          isContains = true;
        }
      }
      // 不存在，添加
      if (!isContains) {
        this.deleteItem.push(id);
      }

      console.log(this.deleteItem);
    },
  },
};
</script>

<style lang="scss" scoped>
.img-wrapper {
  width: 108px;
  height: 152px;
  background: rgba(204, 204, 204, 0.1);
  border-radius: 4px 4px 0 0;
  img {
    width: 100%;

    // height:100%;
  }
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
  box-sizing: border-box;
}
</style>
