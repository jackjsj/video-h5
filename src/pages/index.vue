<template>
  <div class="vh100 flex-col rel">
    <div class="flex-auto rel bg">
      <transition name="slide">
        <keep-alive>
          <router-view class="view" />
        </keep-alive>
      </transition>
    </div>
    <div class="flex-none">
      <van-tabbar
        active-color="#b000ba"
        inactive-color="#999999"
        :border="false"
        :route="true"
        :fixed="false">
        <van-tabbar-item v-for="(item) in tabbarItems"
          :key="item.name"
          :to="item.to"
          replace>
          <template #icon="props">
            <img v-if="props.active" :src="item.icon.active" />
            <img v-else :src="item.icon.inactive" />
          </template>
          {{item.name}}
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
const tabbarItems = [
  {
    name: '首页',
    icon: {
      active: require('@/assets/images/首页2.png'),
      inactive: require('@/assets/images/首页1.png'),
    },
    to: '/home',
  },
  {
    name: '频道',
    icon: {
      active: require('@/assets/images/频道2.png'),
      inactive: require('@/assets/images/频道1.png'),
    },
    to: '/banner',
  },
  {
    name: '漫画',
    icon: {
      active: require('@/assets/images/漫画2.png'),
      inactive: require('@/assets/images/漫画1.png'),
    },
    to: '/caricatureList',
  },
  {
    name: '明星',
    icon: {
      active: require('@/assets/images/明星2.png'),
      inactive: require('@/assets/images/明星1.png'),
    },
    to: '/star',
  },
  {
    name: '排行',
    icon: {
      active: require('@/assets/images/排行2.png'),
      inactive: require('@/assets/images/排行1.png'),
    },
    to: '/rankingList',
  },
  {
    name: '我的',
    icon: {
      active: require('@/assets/images/我的2.png'),
      inactive: require('@/assets/images/我的1.png'),
    },
    to: '/personalCenter',
  },
];
export default {
  data() {
    return {
      tabbarItems,
    };
  },
};
</script>

<style lang="scss" scoped>
.view {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
