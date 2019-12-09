<template>
  <div class="bg flex-col">
    <van-nav-bar
      class="flex-none"
      title="排行"
      :border="false">
      <van-icon name="search" slot="right" color="#fff" />
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
          <!-- 前三 -->
          <div class="mb25 flex jcc">
            <div class="first-3 flex1 flex-col aic"
              v-for="item in first3"
              :key="item.index">
              <div class="first-3-image flex jcc">
                <van-image fit="contain" :src="rank(item.index).video_cover" />
              </div>
              <p class="mc-gray f14 fw400 ell video-name tc">{{rank(item.index).video_name}}</p>
              <div class="platform"></div>
              <div class="platform-front flex jcc">
                <div class="badge"></div>
              </div>
            </div>
          </div>
          <!-- 前三名外 -->
          <div>
            <div
              class="rank-item flex aic"
              v-for="(item,index) in last()"
              :key="item.id">
              <p class="rank-item-no f12">NO.{{index+4}}</p>
              <div class="img-position rel">
                <div class="img-wrapper ovh flex jcc">
                  <van-image fit="contain" :src="item.video_cover" />
                </div>
              </div>
              <div class="mc-gray">
                <p class="f16 fw600 video-name ell">{{item.video_name}}</p>
                <div class="flex aic">
                  <div class="flex aic f12 mr10">
                    <van-icon class="mr3" name="play-circle" />
                    <span class="mr3">播放</span>
                    <p>{{item.payNum}}</p>
                  </div>
                  <div class="flex aic f12">
                    <van-icon class="mr3" name="good-job" />
                    <span class="mr3">点赞</span>
                    <p>{{item.cent}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tabs>
    </div>
    <van-overlay :show="overlayVisible" />
  </div>
</template>

<script>
import { findEverydayPays, findWeeklyPays, findMonthlyPays } from '@/api/';

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

const apis = [findEverydayPays, findWeeklyPays, findMonthlyPays];

export default {
  data() {
    return {
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
          id: index,
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
  },
};
</script>

<style lang="scss" scoped>
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
.mc-gray {
  color: #cfae98;
}
.fw600 {
  font-weight: 600;
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
.video-name {
  width: 150px;
}
.first-3-image {
  width: 113px;
  height: 64px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
.first-3 {
  flex: none;
  width: 33%;
  .video-name {
    width: 100%;
  }
  .platform {
    width: 100%;
    height: 13px;
    background: #3d3466;
    transform: perspective(100px) rotateX(20deg);
    margin-top: 6px;
  }
  .badge {
    width: 26px;
    height: 33.5px;
    background-size: cover;
  }
  &:nth-child(1) {
    margin-top: 41px;
    .badge {
      background-image: url(~@/assets/images/rankBadge2.png);
    }
  }
  &:nth-child(2) {
    .badge {
      background-image: url(~@/assets/images/rankBadge1.png);
    }
  }
  &:nth-child(3) {
    margin-top: 41px;
    .badge {
      background-image: url(~@/assets/images/rankBadge3.png);
    }
  }
  .platform-front {
    height: 34px;
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(49, 42, 82, 1) 0%,
      rgba(49, 42, 82, 0) 100%
    );
  }
}
</style>
