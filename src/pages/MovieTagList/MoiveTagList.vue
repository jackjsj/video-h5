<template>
  <div class="bg-2 flex-col vh100">
    <van-nav-bar
      class="flex-none bgwh1"
      :title="tagName"
      left-arrow
      @click-left="$router.back()"
      :border="false" />
    <div class="flex-auto ova">
      <!-- 列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        finished-text="没有更多了"
        @load="getMovieList">
        <div class="list flex flex-wrap jcb">
          <div
            class="item mb15"
            v-for="item in movieList"
            :key="item.id"
            @click="toVideoPage(item.id)">
            <div class="img-wrapper rel flex jcc ovh">
              <van-image :src="item.videoCover" />
              <div class="abs cover-logo flex jcc" v-if="item.logoCover">
                <van-image :src="item.logoCover" />
              </div>
              <p class="abs movie-duration" v-if="item.duration">{{item.duration}}</p>
            </div>
            <p class="cb9 f16 item-name ell">{{item.videoName}}</p>
          </div>
          <div class="item-pad"></div>
        </div>
      </van-list>
    </div>
  </div>

</template>

<script>
import { Base64 } from 'js-base64';
import { getMovieList } from '../../api';

export default {
  name: 'Bannel',
  data() {
    return {
      onFetching: false, // 分页查询上锁
      dataOnNull: false,
      pageNum: 1,
      movieList: [], // 电影数据
      tagId: null,
      tagName: '',
      loading: false,
      finished: false,
      error: false,
    };
  },
  mounted() {
    // 获取参数
    const { tagId, tagName } = this.$route.params;
    this.tagId = tagId;
    this.tagName = Base64.decode(tagName);
    // 初始化数据
  },
  methods: {
    async getMovieList() {
      const params = {
        pageNum: this.pageNum,
        tagIds: this.tagId,
      };
      const result = await getMovieList(params);
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
      } else {
        this.error = true;
      }
    },
    toVideoPage(id) {
      this.$router.push(`/video/${id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 15px 13px;
}
.video-list-wrapper {
  padding: 0 15px;
}
.video-list-header {
  padding: 0 6px 10px 3px;
}
.img-wrapper {
  width: 168px;
  height: 95px;
  background: rgba(204, 204, 204, 0.1);
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.item-pad {
  width: 168px;
}
.item-name {
  background: #161616;
  height: 34px;
  line-height: 34px;
  padding: 0 6px;
  width: 168px;
  box-sizing: border-box;
}
</style>
