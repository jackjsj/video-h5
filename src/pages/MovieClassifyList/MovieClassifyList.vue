<template>
  <div class="bg-2 flex-col vh100 movie-classify">
    <van-nav-bar
      class="flex-none"
      :title="filters[0].current"
      left-arrow
      @click-left="$router.back()"
      :border="false">
      <van-icon name="search" slot="right" color="#fff"
        @click="$router.push('/movieSearch')" />
    </van-nav-bar>
    <!-- 过滤条件 -->
    <div class="f14 pt15 pl15 pr15 flex-none" style="color:#fffaff">
      <!-- 条件项 -->
      <div
        class="mb10"
        v-for="(filter,index) in filters"
        :key="index">
        <!-- <div
          class="filter-item flex-none"
          v-for="item in filter.items"
          :class="{active:item.name === filter.current}"
          :key="item.name"
          @click="onFilterItemClick(filter, item)">
          {{item.name}}
        </div> -->
        <van-tabs
          :border="false"
          title-inactive-color="#FFFAFF"
          v-model="filter.current"
          @click="(name,title)=>onFilterItemClick(filter,title)">
          <van-tab
            class="filter-item"
            v-for="item in filter.items"
            :key="item.name"
            :name="item.name"
            :title="item.name"></van-tab>
        </van-tabs>
      </div>
    </div>
    <!-- 列表 -->
    <div class="flex-auto ova pl15 pr15 pt5 pb15">
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
            </div>
            <p class="cb9 f16 item-name ell">{{item.videoName}}</p>
          </div>
          <div class="item-pad"></div>
        </div>
      </van-list>
    </div>
    <van-overlay
      @click="onOverlayClick"
      :show="overlayVisible" />
  </div>
</template>

<script>
import { getMovieList } from '@/api';

const list = new Array(9).fill().map((item, index) => ({
  videoName: '宝可梦',
  videoCover: '',
  id: index,
}));
// 地区
const areas = [
  {
    name: '全部地区',
  },
  {
    name: '欧美',
  },
  {
    name: '港台',
  },
  {
    name: '非洲',
  },
  {
    name: '澳洲',
  },
];

// 类型
const types = [
  {
    name: '动漫',
    id: 8,
  },
  {
    name: '科幻',
    id: 7,
  },
  {
    name: '恐怖',
    id: 6,
  },
  {
    name: '喜剧',
    id: 5,
  },
  {
    name: '剧情',
    id: 4,
  },
  {
    name: '动作',
    id: 3,
  },
  {
    name: '战争',
    id: 2,
  },
  {
    name: '全部',
    id: -1,
  },
];

// 标签
const tags = [
  {
    name: '全部标签',
  },
  {
    name: '迷人',
  },
  {
    name: '性感',
  },
  {
    name: '童真',
  },
];

// 年份
const years = [
  {
    name: '全部年份',
  },
  {
    name: '2019',
  },
  {
    name: '2018',
  },
  {
    name: '2017',
  },
];

// 规格
const lengths = [
  {
    name: '全部规格',
  },
  {
    name: '长片',
  },
  {
    name: '短片',
  },
];

// 语言
const langs = [
  {
    name: '全部语言',
  },
  {
    name: '中文字幕',
  },
  {
    name: '国语对白',
  },
];

// 排序
const orders = [
  {
    name: '综合排序',
    type: -1,
  },
  { name: '最多播放', type: 1, key: 'mostPlay' },
  { name: '最近更新', type: 2, key: 'newVideo' },
  { name: '最多好评', type: 3, key: 'mostCare' },
];

export default {
  computed: {
    // 获取当前类型
    currentTypeId() {
      let currentType = this.filters.filter(item => item.name === '类型')[0]
        .current;
      currentType = currentType || this.filters[0].items[0];
      const target = this.filters[0].items.filter(
        item => item.name === currentType,
      );
      return target[0] && target[0].id;
    },
    currentOrderParams() {
      const currentOrder = this.filters.filter(item => item.name === '排序')[0]
        .current;
      const { key } = orders.filter(item => item.name === currentOrder)[0];
      if (key) {
        return {
          [key]: '1',
        };
      }
      return {};
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
      finished: false,
      error: false,
      filters: [
        // {
        //   name: '地区',
        //   current: '全部地区',
        //   items: areas,
        // },
        {
          name: '类型',
          current: '',
          items: [],
        },
        // {
        //   name: '标签',
        //   current: '全部标签',
        //   items: tags,
        // },
        // {
        //   name: '年份',
        //   current: '全部年份',
        //   items: years,
        // },
        // {
        //   name: '规格',
        //   current: '全部规格',
        //   items: lengths,
        // },
        // {
        //   name: '语言',
        //   current: '全部语言',
        //   items: langs,
        // },
        {
          name: '排序',
          current: '综合排序',
          items: orders,
        },
      ],
      overlayVisible: false,
    };
  },
  async mounted() {
    // 先获取所有的类型
    const result = await getMovieList();
    this.filters[0].items = result.classifyList;
    // 获取路由中的参数，设置默认属性
    const { type = result.classifyList[0].name, order = '综合排序' } = this.$route.query;
    this.filters.filter(item => item.name === '类型')[0].current = type;
    this.filters.filter(item => item.name === '排序')[0].current = order;
    // 查询数据
    // this.getMovieList();
  },
  methods: {
    onOverlayClick() {
      Toast('操作太频繁了');
    },
    onFilterItemClick(filter, name) {
      filter.current = name;
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
      // Toast.loading({
      //   message: '加载中...',
      //   loadingType: 'spinner',
      //   duration: 0,
      //   forbidClick: true,
      //   overlay: true,
      // });
      // this.overlayVisible = true;
      const params = {
        pageNum: this.pageNum,
        classifyId: this.currentTypeId, // 类型
        ...this.currentOrderParams, // 排序方式
      };
      const result = await getMovieList(params);
      if (result.retCode === '1') {
        const { current, pages, data, classifyList } = result;
        this.filters[0].items = classifyList;
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
      // this.overlayVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-item {
  padding: 5px 15px;
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
.van-overlay {
  background: transparent;
}
</style>
<style lang="scss">
.movie-classify {
  .van-tab.van-tab--active {
    border-radius: 30px;
  }
  .van-tabs__nav--card {
    border: none;
  }
  .van-tabs__wrap van-tabs__wrap--scrollable {
    height: auto;
  }
  .van-tab {
    border-right: 0;
    border-radius: 30px;
    height: 30px;
    line-height: 30px;
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
  .van-tabs__content {
    height: 0;
  }
  .van-tabs__nav--line {
    padding: 0;
  }
  .van-tabs--line .van-tabs__wrap {
    height: auto;
  }
}
</style>
