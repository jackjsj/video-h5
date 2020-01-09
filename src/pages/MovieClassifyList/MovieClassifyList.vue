<template>
  <div class="bg-2 flex-col vh100 movie-classify">
    <van-nav-bar
      class="flex-none"
      :title="title"
      :left-arrow="$route.path !== '/banner'"
      @click-left="$router.back()"
      :border="false">
      <van-icon name="search" slot="right" color="#fff"
        @click="$router.push('/movieSearch')" />
    </van-nav-bar>
    <div class="flex-auto ova">
      <!-- 过滤条件 -->
      <div class="f14 pt15 pl15 pr15" style="color:#fffaff">
        <!-- 条件项 -->
        <div
          class="mb10"
          v-for="(filter,index) in filters"
          :key="index">
          <van-tabs
            :border="false"
            title-inactive-color="#FFFAFF"
            v-model="filter.current"
            @click="(name,title)=>onFilterItemClick(filter,title)">
            <van-tab
              class="filter-item"
              v-for="item in filter.items"
              :key="item.name"
              :name="item.id"
              :title="item.name">
              <div v-if="filter.name === '标签类型' && item.name!=='全部类型'"
                class="pt10">
                <div class="flex" :class="{short:!isExpandTag}">
                  <div class="flex-none">
                    <p class="filter-item van-tab"
                      :class="{active:currentTags.filter(item=>item.checked).length === 0}"
                      @click="onAllTagClick">全部标签</p>
                  </div>
                  <div class="flex-auto">
                    <div class="btn-box-wrapper flex jcc aic rel">
                      <img class="btn-box" src="@/assets/images/btn-box.png" />
                      <p class="abs wh flex aic jcc btn-box-text">
                        <span @click="isExpandTag = !isExpandTag">{{isExpandTag ? '收起':'展开'}}</span>
                        <van-icon :name="!isExpandTag?'arrow-down':'arrow-up'" />
                      </p>
                    </div>
                    <p class="filter-item tag-filter-item mb10 van-tab"
                      :class="{active:tag.checked}"
                      @click="onTagClick(tag)"
                      v-for="tag in currentTags"
                      :key="tag.id">{{tag.name}}</p>
                    <div style="clear:both;"></div>
                  </div>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
      <!-- 列表 -->
      <div class="pl15 pr15 pt5 pb15">
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
              @click="$router.push(`/video/${item.id}`)">
              <div class="img-wrapper rel flex jcc">
                <van-image :src="item.videoCover" />
                <div class="abs cover-logo flex jcc" v-if="item.logoCover">
                  <van-image :src="item.logoCover" />
                </div>
                <p class="abs movie-duration" v-if="item.duration">{{item.duration}}</p>
              </div>
              <p class="cb9 item-name">
                <span class="movie-name">{{item.videoName}}</span>
              </p>
            </div>
            <div class="item-pad"></div>
          </div>
        </van-list>
      </div>
    </div>

    <van-overlay
      @click="onOverlayClick"
      :show="overlayVisible" />
  </div>
</template>

<script>
import { getMovieList, search, getTagByTagTypeId } from '@/api';

// 排序
const orders = [
  {
    name: '综合排序',
    id: -1,
  },
  { name: '最多播放', id: 1, key: 'playNum' },
  { name: '最近更新', id: 2, key: 'newVideo' },
  { name: '最多好评', id: 3, key: 'careNum' },
];

export default {
  computed: {
    // 获取当前类型
    classifyId() {
      return this.filters.filter(item => item.name === '类型')[0].current;
    },
    currentOrderParams() {
      const currentOrder = this.filters.filter(item => item.name === '排序')[0]
        .current;
      const { key } = orders.filter(item => item.id === currentOrder)[0];
      if (key) {
        return {
          [key]: '1',
        };
      }
      return {};
    },
    // // 地区
    // districtId() {
    //   return this.filters.filter(item => item.name === '地区')[0].current;
    // },
    // // 年代
    // yearsId() {
    //   return this.filters.filter(item => item.name === '年代')[0].current;
    // },
    // 时长
    durationTypeId() {
      return this.filters.filter(item => item.name === '时长')[0].current;
    },
    // 规格
    videoClassifyId() {
      return this.filters.filter(item => item.name === '规格')[0].current;
    },
    // 语言
    languageId() {
      return this.filters.filter(item => item.name === '语言')[0].current;
    },
    // 标签类型
    tagTypeId() {
      return this.filters.filter(item => item.name === '标签类型')[0].current;
    },
    tagIds() {
      const tagIds = this.currentTags
        .filter(item => item.checked)
        .map(item => item.id);
      return tagIds.length > 0 ? tagIds : undefined;
    },
    title() {
      const typeFilter = this.filters.filter(item => item.name === '类型')[0];
      const target = typeFilter.items.filter(
        item => item.id === typeFilter.current,
      );
      return target[0] && target[0].name;
    },
  },
  data() {
    return {
      onFetching: false, // 分页查询上锁
      dataOnNull: false,
      pageParams: {
        pageNum: 1, // 当前页
        classifyId: null, // 分类id
        orderStr: '', // 排序字段
      },
      orderList: [],
      orderIndex: 0,
      movieList: [], // 电影数据
      classifyList: [], // 分类数据
      classifyIndex: null,
      isInit: true, // 是否为初始化
      //
      list: [],
      pageNum: 1,
      loading: false,
      finished: true,
      error: false,
      filters: [
        // {
        //   name: '地区',
        //   current: -1,
        //   items: [],
        //   key: 'districTagList',
        //   all: '全部地区',
        // },
        {
          name: '类型',
          current: -1,
          items: [],
          all: '全部馆别',
          key: 'classifyList',
        },
        {
          name: '标签类型',
          current: -1,
          items: [],
          key: 'tagTypeList',
          all: '全部类型',
        },
        // {
        //   name: '年代',
        //   current: -1,
        //   items: [],
        //   key: 'yearsTagList',
        //   all: '全部年代',
        // },
        {
          name: '时长',
          current: -1,
          items: [],
          key: 'durationTypeTagList',
          all: '全部时长',
        },
        {
          name: '规格',
          current: -1,
          items: [],
          key: 'videoClassifyTagList',
          all: '全部规格',
        },
        {
          name: '语言',
          current: -1,
          items: [],
          key: 'languageTagList',
          all: '全部语言',
        },
        {
          name: '排序',
          current: -1,
          items: orders,
        },
      ],
      overlayVisible: false,
      currentTags: [],
      isExpandTag: false,
    };
  },
  async mounted() {
    // 先获取所有的类型
    Toast.loading({
      message: '加载中...',
      loadingType: 'spinner',
      duration: 0,
    });
    const result = await search();
    if (result.retCode === '1' && result.httpCode === 200) {
      const { data } = result;
      this.filters.forEach(filter => {
        if (filter.key) {
          if (filter.all) {
            filter.items.push({
              id: -1,
              name: filter.all,
            });
          }
          filter.items.push(...data[filter.key]);
        }
      });
      this.finished = false;
      Toast.clear();
    } else {
      Toast(result.retMsg || result.msg);
    }
    // 获取路由中的参数，设置默认属性
    const { type = -1, order = -1, tagType = -1 } = this.$route.query;
    this.filters.filter(item => item.name === '类型')[0].current = parseInt(
      type,
    );
    this.filters.filter(item => item.name === '排序')[0].current = parseInt(
      order,
    );
    this.filters.filter(item => item.name === '标签类型')[0].current = parseInt(
      tagType,
    );
  },
  methods: {
    onTagClick(tag) {
      tag.checked = !tag.checked;
      this.pageNum = 1;
      this.movieList = [];
      this.finished = false;
      this.loading = true;
      this.error = false;
      this.getMovieList();
    },
    onAllTagClick() {
      // 清空所有标签选中
      this.currentTags.forEach(item => (item.checked = false));
      this.pageNum = 1;
      this.movieList = [];
      this.finished = false;
      this.loading = true;
      this.error = false;
      // 查询数据
      this.getMovieList();
    },
    onOverlayClick() {
      Toast('操作太频繁了');
    },
    async onFilterItemClick(filter) {
      // 如果是标签类型
      if (filter.name === '标签类型') {
        // 根据当前的标签类型查询标签列表
        this.currentTags = [];
        if (filter.current !== -1) {
          const resp = await getTagByTagTypeId(filter.current);
          if (resp.retCode === '1') {
            this.currentTags = resp.data.map(item => ({
              ...item,
              checked: false,
            }));
          } else {
            Toast(resp.retMsg || resp.msg);
          }
        } else {
          this.isExpandTag = false;
        }
      }
      // 重置页码
      this.pageNum = 1;
      this.movieList = [];
      this.finished = false;
      this.loading = true;
      this.error = false;
      // 查询数据
      this.getMovieList();
    },
    // 查询数据,不分页
    async getMovieList() {
      const params = {
        pageNum: this.pageNum,
        classifyId: String(this.classifyId), // 分类
        // districtId: String(this.districtId), // 地区
        // yearsId: String(this.yearsId), // 年代
        videoClassifyId: String(this.videoClassifyId), // 规格
        durationTypeId: String(this.durationTypeId), // 时长
        languageId: String(this.languageId), // 语言
        tagTypeId: String(this.tagTypeId), // 标签类型
        tagIds: this.tagIds,
        ...this.currentOrderParams, // 排序方式
      };
      const result = await search(params);
      if (result.retCode === '1') {
        const { page } = result.data;
        const { pages, current, records } = page;
        this.loading = false;
        if (current === pages || pages === 0 || records.length === 0) {
          // 最后一页了
          this.finished = true;
        } else {
          this.pageNum++;
        }
        if (current === 1) {
          this.movieList = records;
        } else {
          this.movieList.push(...records);
        }
      } else {
        this.error = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  border-radius: 30px;
  line-height: 20px;
  &.active {
    background: linear-gradient(#e95aa0, #a769ff);
  }
}
.img-wrapper {
  width: 168px;
  height: 95px;
  background: rgba(204, 204, 204, 0.1);
  border-radius: 12px 12px 0 0;
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
  border-radius: 0 0 12px 12px;
}
.van-overlay {
  background: transparent;
}
.btn-box {
  width: 60px;
  height: 24px;
}
.btn-box-text {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.tag-box {
  padding-left: 90px;
  min-height: 40px;
}
.btn-box-wrapper {
  height: 30px;
  float: right;
  margin-bottom: 10px;
}
.tag-filter-item.van-tab {
  float: left;
}
.short {
  height: 30px;
  overflow: hidden;
}
</style>
<style lang="scss">
.movie-classify {
  .van-tab.van-tab--active {
    border-radius: 30px;
    border: none;
  }
  .van-tabs__nav--card {
    border: none;
  }
  .van-tabs__wrap {
    height: auto;
  }
  .van-tab {
    display: flex;
    align-items: center;
    border-right: 0;
    border-radius: 30px;
    height: 30px;
    flex: none !important;
    margin-right: 5px;
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    &.active {
      border: none;
      background: linear-gradient(#e95aa0, #a769ff);
    }
  }
  .van-tabs__nav {
    background: transparent;
    margin: 0;
  }
  .van-tabs__line {
    background-color: transparent;
  }
  // .van-tabs__content {
  //   height: 0;
  // }
  .van-tabs__nav--line {
    padding: 0;
  }
  .van-tabs--line .van-tabs__wrap {
    height: auto;
    border-radius: 0;
    overflow-x: auto;
  }
}
</style>
