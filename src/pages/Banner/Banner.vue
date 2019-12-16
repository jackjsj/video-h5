<template>
  <div class="bg flex-col">
    <van-nav-bar
      class="flex-none"
      title="频道"
      :border="false">
    </van-nav-bar>
    <div class="flex-col flex-auto ova">
      <van-tabs
        :border="false"
        :line-height="0"
        @change="onTabChange">
        <van-tab
          v-for="type in types"
          :key="type.id"
          :title="type.name"
          :name="type.id">
        </van-tab>
      </van-tabs>
      <div class="list flex flex-wrap jcb flex-auto ova content"
        style="align-content:flex-start;">
        <div
          class="item mb15"
          v-for="item in list"
          :key="item.id"
          @click="goto(item.id, item.name)">
          <div class="img-wrapper rel flex aic jcc ovh">
            <van-image :src="item.picUrl" />
          </div>
          <p class="cb9 f16 item-name ell">{{item.name}}</p>
        </div>
        <div class="item-pad"></div>
        <div class="item-pad"></div>
      </div>
    </div>
    <van-overlay :show="overlayVisible" />
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import { getTagType, getTagByTagTypeId } from '@/api';

const types = [
  {
    name: '亚洲',
  },
  {
    name: '欧美',
  },
  {
    name: '国产',
  },
];
const list = new Array(10).fill().map((item, index) => ({
  name: '我的英雄学院',
  status: '连载中',
  picUrl: '',
  id: index,
}));

export default {
  name: 'Bannel',
  data() {
    return {
      tagTypes: null,
      tags: null,

      types: [],
      list: [],
      overlayVisible: false,
    };
  },
  mounted() {
    this.getTagType();
  },
  methods: {
    // 页面跳转
    goto(tagId, tagName) {
      this.$router.push(`/movieTagList/${tagId}/${Base64.encode(tagName)}`);
    },
    /**
     * 查询标签类型
     * @returns {Promise<void>}
     */
    async getTagType() {
      this.overlayVisible = true;
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const resp = await getTagType();
      if (resp.retCode === '1') {
        this.types = resp.data;
        //默认查第一个类型
        const first = this.types[0];
        if (first) {
          this.getTagsByType(first.id);
        }
      }
    },
    /**
     *
     * @param tagTypeId 根据标签类型获取数据
     */
    async getTagsByType(id) {
      this.overlayVisible = true;
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
      });
      const resp = await getTagByTagTypeId(id);
      if (resp.retCode === '1') {
        this.list = resp.data;
        Toast.clear();
        this.overlayVisible = false;
      }
    },
    onTabChange(typeId) {
      this.getTagsByType(typeId);
    },
    /**
     * 跳转电影搜索页面
     */
    toMovieSearPage(tagId) {
      console.log(tagId);
    },
  },
};
</script>

<style lang="scss" scoped>
.van-tabs {
  padding: 0 15px;
}
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
  border-radius:0 0 4px 4px;
}
.content {
  padding: 0 15px;
  margin: 20px 0;
}
</style>
