<template>
  <!-- 明星详情 -->
  <div class="bg-2 flex-col vh100">
    <van-nav-bar
      class="flex-none"
      title="个人主页"
      left-arrow
      @click-left="$router.back()"
      :border="false">
    </van-nav-bar>
    <div class="flex-auto ova wh content">
      <!-- 基本信息 -->
      <div class="flex-col aic">
        <div class="star-avatar flex jcc">
          <van-image :src="detail.headpic"></van-image>
        </div>
        <p class="mb8 f20 fw400">{{detail.name}}</p>
        <button class="fav-btn"
          :class="{isFav:detail.isCollect==='1'}"
          @click="saveMemberCollect(rank(item.index).id,rank(item.index).isCollect)">收藏</button>
        <div class="flex jcc f13 mt18">
          <p class="mr26">身高：{{detail.heightNum}}cm</p>
          <p class="mr26">三围：{{detail.bwh}}</p>
          <p>罩杯：{{detail.cup}}</p>
        </div>
      </div>
      <!-- 简介 -->
      <div class="p15">
        <p class="f16 fw500 mb5">简介</p>
        <p class="f13 opa5 lh21"
          :class="{'van-multi-ellipsis--l4':!showMore}">
          {{detail.briefContext}}
        </p>
        <div class="flex aic"
          style="justify-content:flex-end;"
          @click="showMore = !showMore">
          <span>{{showMore?'收起':'更多'}}</span>
          <van-icon :name="showMore?'arrow-up':'arrow-down'" />
        </div>
      </div>
      <!-- 相关影片 -->
      <div class="p15">
        <div class="flex jcb mb15 aic">
          <p class="f16 fw500">相关影片（{{movieList.length}}部）</p>
          <div class="flex tabs aic">
            <p class="flex1 tc tab" :class="{active:activeTab === '最多播放'}"
              @click="toggleTab('最多播放')">最多播放</p>
            <p class="flex1 tc tab" :class="{active:activeTab === '最近更新'}"
              @click="toggleTab('最近更新')">最近更新</p>
          </div>
        </div>
        <!-- 列表 -->
        <van-list
          v-model="loading"
          :finished="finished"
          :error.sync="error"
          finished-text="没有更多了"
          @load="getMovieList">
          <div
            class="item flex aic mb15"
            v-for="item in movieList"
            :key="item.id"
            @click="$router.push(`/video/${item.id}`)">
            <div class="flex aic">
              <div class="item-cover flex jcc mr13 flex-none">
                <van-image
                  :src="item.videoCover" />
              </div>
              <div class="flex-col jca">
                <p class="wh f16 opa9 fw500 lh23 mb8">{{item.videoName}}</p>
                <p class="f12 wh opa5 fw400">{{moment(item.pushTime).format('YYYY-MM-DD')}}</p>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { saveMemberCollect, delMemberCollect, getMovieList } from '@/api';

const records = new Array(10).fill().map((item, index) => ({
  videoCover: '',
  videoName: '动物管理局静林宝可梦：大家的故事的时尚',
  viewTime: '2019-11-30',
  id: index,
}));
const mapping = {
  最多播放: 'mostPlay',
  最近更新: 'newVideo',
};
export default {
  data() {
    return {
      detail: {},
      movieList: [],
      activeTab: '最多播放',
      showMore: false,
      loading: false,
      finished: false,
      error: false,
      pageNum: 1,
      moment
    };
  },
  computed: {
    currentOrderParams() {
      const key = mapping[this.activeTab];
      return {
        [key]: '1',
      };
    },
  },
  mounted() {
    const item = window.localStorage.getItem('currentStar');
    if (item) {
      const currentStar = JSON.parse(item);
      this.detail = currentStar;
    }
  },
  methods: {
    // 收藏明星
    async saveMemberCollect(id, isCollect) {
      if (!isCollect) {
        return;
      }
      let result = null;
      // 如果已收藏则取消收藏
      if (isCollect === '1') {
        result = await delMemberCollect(id);
      } else {
        //收藏
        result = await saveMemberCollect(id);
      }
      if (result.retCode === '1') {
        //修改状态
        this.updateCollectState(id, isCollect);
      }
      Toast(result.retMsg);
    },
    // 切换tab
    toggleTab(tab) {
      this.activeTab = tab;
      this.movieList = [];
      this.pageNum = 1;
      this.loading = true;
      this.finished = false;
      this.error = false;
      this.getMovieList();
    },
    // 获取相关影片列表
    async getMovieList() {
      const result = await getMovieList({
        starId: this.detail.id,
        ...this.currentOrderParams,
      });
      if (result.retCode === '1') {
        const { current, pages, data } = result;
        this.loading = false;
        if (current === pages || pages === 0) {
          // 最后一页了
          this.finished = true;
        } else {
          this.pageNum++;
        }
        if (current === 1) {
          this.movieList = data;
        } else {
          this.movieList.push(...data);
        }
      }else{
        this.error = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item-cover {
  width: 126px;
  height: 71px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}
.tabs {
  width: 145px;
  height: 28px;
  border: 1px solid #a769ff;
  border-radius: 28px;
  overflow: hidden;
}
.tab {
  border-radius: 28px;
  height: 28px;
  line-height: 28px;
  &.active {
    background: linear-gradient(#e95aa0, #a769ff);
  }
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
.star-avatar {
  width: 85px;
  height: 85px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
}
.content {
  margin-top: 45px;
}
</style>
