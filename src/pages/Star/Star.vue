<template>
  <div class="bg flex-col star">
    <van-nav-bar
      class="flex-none"
      title="明星"
      :border="false">
    </van-nav-bar>
    <div class="content flex-col flex-auto ova rel">
      <van-tabs
        class="pl15 pr15 flex-col vh100"
        :border="false"
        :line-height="0"
        @change="onTabChange"
        v-model="currentType">
        <van-tab
          v-for="type in types"
          :key="type.name"
          :title="type.name"
          :name="type.key">
        </van-tab>
        <!-- 明星列表 -->
        <div>
          <!-- 前三名 -->
          <div class="flex flexend jcb first-3">
            <div
              class="tc mc-gray lh18 flex-col aic"
              v-for="(item,index) in first3"
              :key="index"
              @click="showStarDetail(rank(item.index))">
              <div class="seat mb12 rel" :class="item.class">
                <van-image fit="cover" class="avatar" :src="rank(item.index).headpic" />
              </div>
              <p class="f16 mb5">{{rank(item.index).name}}</p>
              <div class="flex aic mb10">
                <img class="fire-img" src="@/assets/images/fire.png" />
                <p class="f14">{{rank(item.index).heat}}</p>
              </div>
              <button class="fav-btn"
                :style="`opacity:${rank(item.index).isCollect !== undefined ? '1':'0'}`"
                :class="{isFav:rank(item.index).isCollect==='1'}"
                @click.stop="saveMemberCollect(rank(item.index).id,rank(item.index).isCollect)">收藏</button>
            </div>
          </div>
          <div class="pt20 pb20 pl5 pr5">
            <van-list
              v-model="loading"
              :finished="finished"
              :error.sync="error"
              finished-text="没有更多了"
              @load="getStarList">
              <div
                class="flex aic mc-gray f13 mb10"
                v-for="(item,index) in last()"
                :key="item.id"
                @click="showStarDetail(item)">
                <p class="rank-num">{{index+4}}</p>
                <img class="avatar" :src="item.headpic" />
                <div class="flex aic p12 star-info">
                  <span class="star-name">{{item.name}}</span>
                  <div class="flex aic">
                    <img class="fire-img" src="@/assets/images/fire.png" />
                    <p class="fire-num">{{item.heat}}</p>
                  </div>
                  <button class="fav-btn"
                    :class="{isFav:item.isCollect === '1'}"
                    @click.stop="saveMemberCollect(item.id,item.isCollect)">收藏</button>
                </div>
              </div>
            </van-list>
          </div>
        </div>
      </van-tabs>
      <div class="index-bar">
        <p
          class="tc index-item"
          :class="{active:item.value === currentCup}"
          v-for="item in cupList"
          :key="item.name"
          @click="onCupClick(item)">
          {{item.name}}
        </p>
      </div>
    </div>
    <van-overlay :show="overlayVisible" />
  </div>
</template>

<script>
import Vue from 'vue';

import { getStarList, saveMemberCollect, delMemberCollect } from '@/api';

const first3 = [
  {
    class: 'rank2',
    index: 1,
  },
  {
    class: 'rank1',
    index: 0,
  },
  {
    class: 'rank3',
    index: 2,
  },
];
const types = [
  {
    name: '最近更新',
    key: 'newData',
  },
  {
    name: '人气最高',
    key: 'newVideo',
  },
  {
    name: '片量最多',
    key: 'videoNum',
  },
];

const list = new Array(10).fill().map((item, index) => ({
  name: '虚位以待',
  id: index,
  heat: 30000,
  headpic: require('@/assets/images/avatar.png'),
}));

export default {
  name: 'Actress',
  data() {
    return {
      starList: [],
      cupList: [], // 分类数据
      selectClassIfyIndex: 0,
      cupIndex: 0, // 默认为查询全部
      heat: 0, // 热度
      onFetching: false, // 分页查询上锁
      dataOnNull: false,
      pageParams: {
        pageNum: 1,
        orderStr: null, // 排序标识
        cup: null,
      },

      types,
      list: [],
      first3,
      overlayVisible: false,
      loading: false,
      finished: false,
      error: false,
      pageNum: 1,
      currentCup: '-1',
      currentType: 'newData',
    };
  },
  mounted() {
    // this.getStarList();
  },
  computed: {
    rank(index) {
      return index =>
        this.list[index]
          ? this.list[index]
          : {
              name: '虚位以待',
              heat: 0,
            };
    },
  },
  methods: {
    onCupClick(item) {
      this.list = [];
      this.currentCup = item.value;
      this.loading = true;
      this.finished = false;
      this.error = false;
      this.pageNum = 1;
      this.getStarList();
    },
    onTabChange() {
      this.list = [];
      this.loading = true;
      this.finished = false;
      this.error = false;
      this.pageNum = 1;
      this.getStarList();
    },
    showStarDetail(item) {
      if (item.id) {
        window.localStorage.setItem('currentStar', JSON.stringify(item));
        this.$router.push('/starDetail');
      }
    },
    async getStarList() {
      this.overlayVisible = true;
      // Toast.loading({
      //   message: '加载中...',
      //   loadingType: 'spinner',
      //   duration: 0,
      // });

      // 请求参数
      const result = await getStarList({
        [this.currentType]: '1',
        pageNum: this.pageNum,
        cup: this.currentCup,
      });
      if (result.retCode === '1') {
        const { current, pages, data } = result;
        this.cupList = data.cupList;
        this.loading = false;
        if (current === pages || pages === 0) {
          // 最后一页了
          this.finished = true;
        } else {
          this.pageNum++;
        }
        if (current === 1) {
          this.list = data;
        } else {
          this.list.push(...data);
        }
        this.cupList = result.cupList;
        Toast.clear();
        this.overlayVisible = false;
      }
    },

    last() {
      const listCopy = this.list.concat();
      listCopy.splice(0, 3);
      return listCopy;
    },
    // 收藏明星
    async saveMemberCollect(id, isCollect) {
      if (!isCollect) {
        return;
      }
      let result = null;
      // 如果已收藏则取消收藏
      if (isCollect == '1') {
        result = await delMemberCollect(id);
      } else {
        // 收藏
        result = await saveMemberCollect(id);
      }

      if (result.retCode === '1') {
        // 修改状态
        this.updateCollectState(id, isCollect);
      }
      Toast(result.retMsg);
    },
    updateCollectState(id, isCollect) {
      // 根据id找到对应的元素
      const starList = this.list;
      const index = starList.findIndex(star => star.id === id);
      const star = starList[index];
      star.isCollect = isCollect === '1' ? '0' : '1';
      Vue.set(this.list, index, star);
    },
  },
};
</script>

<style lang="scss" scoped>
.first-3 {
  margin: 13px 32px 0 25px;
}
.seat {
  width: 58px;
  height: 61px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .avatar {
    position: absolute;
    bottom: 3.5px;
    right: 3.5px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    overflow: hidden;
  }
  &.rank2 {
    background-image: url('~@/assets/images/rank2.png');
  }
  &.rank1 {
    width: 70px;
    height: 73px;
    background-image: url('~@/assets/images/rank1.png');
    .avatar {
      width: 55px;
      height: 55px;
      bottom: 5px;
      right: 5px;
      border-radius: 50%;
    }
  }
  &.rank3 {
    background-image: url('~@/assets/images/rank3.png');
  }
}
.lh18 {
  line-height: 18px;
}
.mc-gray {
  color: #cfae98;
}
.fav-btn {
  width: 59px;
  height: 26px;
  color: #fff;
  font-size: 14px;
  background: transparent;
  border: 1px solid #a769ff;
  outline: none;
  border-radius: 12px;
  &:active {
    opacity: 0.7;
  }
  &.isFav {
    background: linear-gradient(#e95aa0, #a769ff);
  }
}
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.fire-img {
  width: 11px;
  height: 16px;
  margin-right: 8px;
}
.rank-num {
  width: 25px;
}
.p12 {
  padding: 12px;
}
.star-name {
  width: 74px;
}
.f13 {
  font-size: 13px;
}
.fire-num {
  width: 74px;
}
.star-info {
  border-bottom: 1px solid rgba(153, 153, 153, 0.2);
}
.index-bar {
  width: 22px;
  border-radius: 22px;
  background: black;
  color: #fff;
  position: absolute;
  top: 65px;
  bottom: 10px;
  right: 10px;
  font-size: 16px;
  padding: 5px 2px;
}
.index-item {
  margin-bottom: 10px;
  transition: all 0.3s;
  &.active {
    background: #0021e0;
    border-radius: 100%;
  }
}
</style>
<style lang="scss">
.star {
  .van-tabs__content {
    flex: auto;
    overflow: auto;
  }
  .van-tabs--line .van-tabs__wrap {
    width: 100%;
    flex: none;
  }
}
</style>
