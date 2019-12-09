<template>
  <div class="bg flex-col star">
    <van-nav-bar
      class="flex-none"
      title="明星"
      :border="false">
      <van-icon name="search" slot="right" color="#fff" />
    </van-nav-bar>
    <div class="content flex-col flex-auto ova">
      <van-tabs
        :border="false"
        :line-height="0">
        <van-tab
          v-for="type in types"
          :key="type.name"
          :title="type.name">
        </van-tab>
        <!-- 明星列表 -->
        <div>
          <!-- 前三名 -->
          <div class="flex flexend jcb first-3">
            <!-- 第二名 -->
            <div
              class="tc mc-gray lh18"
              v-for="item in first3"
              :key="item.class">
              <div class="seat mb12 rel" :class="item.class">
                <img class="avatar" src="@/assets/images/avatar.png" />
              </div>
              <p class="f16">{{rank(item.index).name}}</p>
              <p class="f14 mb15">{{rank(item.index).num}}</p>
              <button class="fav-btn isFav">收藏</button>
            </div>
          </div>
          <div class="p20">
            <div
              class="flex aic mc-gray f13 mb10"
              v-for="(item,index) in last()"
              :key="item.id">
              <p class="rank-num">{{index+4}}</p>
              <img class="avatar" src="@/assets/images/avatar.png" />
              <div class="flex aic p12 star-info">
                <span class="star-name">{{item.name}}</span>
                <div class="flex aic">
                  <img class="fire-img" src="@/assets/images/fire.png" />
                  <p class="fire-num">{{item.num}}</p>
                </div>
                <button class="fav-btn">收藏</button>
              </div>
            </div>
          </div>
        </div>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { deviceInfo } from '@/api/';
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
    name: '人气最高',
  },
  {
    name: '片量最多',
  },
  {
    name: '最近更新',
  },
];

const list = new Array(10).fill().map((item, index) => ({
  name: '虚位以待',
  id: index,
  num: 30000,
  avatar: require('@/assets/images/avatar.png'),
}));

export default {
  data() {
    return {
      types,
      list,
      first3,
    };
  },
  mounted() {
    // deviceInfo().then(resp => {
    //   if (resp.retCode === '1') {
    //     // 登录成功
    //   }
    // });
  },
  methods: {
    rank(index) {
      return this.list[index]
        ? this.list[index]
        : {
            name: '虚位以待',
            num: 0,
            id: index,
            avatar: require('@/assets/images/avatar.png'),
          };
    },
    last() {
      const listCopy = this.list.concat();
      listCopy.splice(0, 3);
      return listCopy;
    },
  },
};
</script>

<style lang="scss" scoped>
.first-3 {
  margin: 13px 55px 0;
}
.seat {
  width: 58px;
  height: 61px;
  background-size: cover;
  .avatar {
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 46px;
    height: 46px;
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
  height: 25px;
  color: #fff;
  font-size: 15px;
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
  border-bottom: 1px dashed #999;
}
</style>
