<template>
  <div class="bg flex-col">
    <van-nav-bar
      class="flex-none"
      title="排行"
      :border="false">
      <van-icon name="search" slot="right" color="#fff"
        @click="$router.push('/movieSearch')" />
    </van-nav-bar>
    <div class="content flex-col flex-auto ova">
      <van-tabs
        :border="false"
        :line-height="0"
        @change="onTabChange">
        <van-tab
          v-for="type in types"
          :key="type.name"
          :title="type.name">
        </van-tab>
        <!-- 排名列表 -->
        <div class="mt20">
          <div
            class="mb15"
            v-for="(item,index) in list"
            :key="item.id"
            @click="$router.push(`/video/${item.id}`);">
            <div v-if="index === 0">
              <!-- 第一名 -->
              <div class="flex jcc rank1-image">
                <van-image fit="contain" :src="item.video_cover" />
              </div>
              <div class="rank1-name flex aic">
                <img class="rank-badge flex-none" src="@/assets/images/rankBadge1.png" />
                <div class="flex-auto rel">
                  <p class="ell f16 fw600 rank1-video-name">{{item.video_name}}</p>
                  <div class="flex aic">
                    <div class="flex aic mr10">
                      <van-icon name="play-circle" />
                      <p class="ml3">播放 1000 次</p>
                    </div>
                    <div class="flex aic">
                      <van-icon name="good-job" />
                      <p class="ml3">点赞 100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex aic video-item" v-else>
              <div class="flex flex-none jcc video-cover">
                <van-image fit="contain" :src="item.video_cover" />
              </div>
              <div class="flex-auto">
                <p class="rank-no wh opa5 b mb5"
                  style="border-width:1px;">NO.{{index+1}}</p>
                <p class="mc-gold f16 fw600 lh18 mb2">{{item.video_name}}</p>
                <div class="flex aic mc-gold f12">
                  <div class="flex aic mr10">
                    <van-icon name="play-circle" />
                    <p class="ml3">播放{{item.payNum}}次</p>
                  </div>
                  <div class="flex aic">
                    <van-icon name="good-job" />
                    <p class="ml3">点赞{{item.cent}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tabs>
    </div>
    <van-overlay :show=" overlayVisible" />
  </div>
</template>

<script>
import { findEverydayPays, findMonthlyPays, findWeeklyPays } from '@/api';

const apis = [findEverydayPays, findWeeklyPays, findMonthlyPays];

const types = [
  {
    name: '日榜',
  },
  {
    name: '周榜',
  },
  {
    name: '月榜',
  },
];
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
const list = new Array(10).fill().map((item, index) => ({
  video_name: '锦衣喋血',
  id: index,
  payNum: 1000,
  likeRate: '100%',
  video_cover: '',
}));

export default {
  name: 'Ranking',
  data() {
    return {
      rankingListClassifys: ['日榜', '周榜', '月榜'],
      rankingIndex: 0, //默认选中
      rankingList: [],

      types,
      list: [],
      overlayVisible: false,
      first3,
    };
  },
  mounted() {
    this.getRankList(0);
  },
  methods: {
    async getRankList(index) {
      this.overlayVisible = true;
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const resp = await apis[index]();
      if (resp.retCode === '1') {
        this.list = resp.data;
        Toast.clear();
        this.overlayVisible = false;
      }
    },
    rank(index) {
      return this.list[index]
        ? this.list[index]
        : {
            video_name: '虚位以待',
            payNum: 0,
            cent: '0%',
            video_cover: '',
          };
    },
    last() {
      const listCopy = this.list.concat();
      listCopy.splice(0, 3);
      return listCopy;
    },
    onTabChange(index) {
      this.getRankList(index);
    },

    toMoviePage(id) {
      if (id) {
        this.$router.push(`/video/${id}`);
      }
    },

    getRankingList(index) {
      switch (index) {
        case 0: {
          this.findEverydayPays();
          break;
        }
        case 1: {
          this.findWeeklyPays();
          break;
        }
        case 2: {
          this.findMonthlyPays();
          break;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 0 15px;
}
.rank-item {
  width: 345px;
  height: 69px;
  background: rgba(27, 24, 46, 1);
  border-radius: 10px;
  margin: auto;
  margin-bottom: 24px;
  padding: 10px 10.5px;
  box-sizing: border-box;
}
.rank-item-no {
  width: 40px;
  color: rgba(255, 255, 255, 0.5);
}
.mr3 {
  margin-right: 3px;
}
.img-position {
  width: 120px;
  height: 100%;
  margin-right: 10px;
}
.img-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 119px;
  height: 67px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
.rank1-image {
  height: 194px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px 12px 0 0;
}
.rank-badge {
  width: 26px;
  height: 34px;
  margin-right: 13px;
}
.rank1-name {
  height: 53px;
  background: #1b182e;
  padding: 0 18px;
  color: #cfae98;
}
.rank1-video-name {
  width: 270px;
}
.video-cover {
  width: 165px;
  height: 93px;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 12px;
}
.video-item {
  background: #1b182e;
  border-radius: 10px;
  overflow: hidden;
  padding: 2px 0;
}
.rank-no {
  display: inline-block;
  border: 1px solid #bb4fd1;
  padding: 2px 5px;
  border-radius: 6px;
}
.mc-gold {
  color: #cfae98;
}
.ml3 {
  margin-left: 3px;
}
.mb2 {
  margin-bottom: 2px;
}
</style>
