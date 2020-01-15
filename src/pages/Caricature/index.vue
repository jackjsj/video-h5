<template>
  <!-- 漫画与小说 -->
  <div class="bg flex-col comic-novel">
    <van-nav-bar
      class="flex-none"
      title="漫画与小说"
      :border="false">
    </van-nav-bar>
    <div class="content flex-auto">
      <!-- 轮播 -->
      <div class="top-swiper mb15">

      </div>
      <div class="gate flex">
        <div class="gate-item flex1"
          v-for="item in gateItems"
          :key="item.name">
          <div class="gate-item-name">{{item.name}}</div>
          <button class="enter-btn"
            @click="$router.push(item.to)">点击进入</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
const gateItems = [
  {
    name: '精品漫画',
    bg: '',
    to: '/caricatureList',
  },
  {
    name: '精彩小说',
    bg: '',
    to: '/novelList',
  },
];
export default {
  data() {
    return {
      gateItems,
    };
  },
};
</script>

<style lang="scss" scoped>
.comic-novel {
  height: 100%;
}
.content {
  padding: 15px;
}
.top-swiper {
  height: 175px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}
.gate-item {
  position: relative;
  height: 326px;
  margin-right: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  &:last-child {
    margin-right: 0;
  }
}
.gate-item-name {
  position: absolute;
  width: 29px;
  font-size: 29px;
  color: rgba(51, 51, 51, 1);
  line-height: 40px;
  right: 13px;
  top: 10px;
}
.enter-btn {
  width: 100px;
  height: 35px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  font-size: 15px;
  color: rgba(51, 51, 51, 1);
  border: none;
  position: absolute;
  bottom: 16px;
  left: 50%;
  margin-left: -50px;
  &:active {
    opacity: 0.7;
  }
}
</style>
