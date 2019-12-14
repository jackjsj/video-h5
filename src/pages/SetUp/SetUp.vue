<template>
  <div class="bg-2 flex-col vh100 setting">
    <van-nav-bar
      class="flex-none bgwh1"
      title="设置"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="pl20 pr20">
      <van-cell-group
        :border="false">
        <van-cell v-for="item in items"
          :border="false"
          :key="item.title"
          :title="item.title"
          :value="item.value"
          :is-link="item.isLink"
          :to="item.to">
          <template #icon>
            <div class="item-icon" v-show="item.icon">
              <img :src="item.icon" />
            </div>
          </template>
        </van-cell>
        <van-switch-cell v-model="checked" title="开启手势密码" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const items = [
  {
    title: '账户管理',
    isLink: true,
    icon: require('@/assets/images/账户管理.png'),
    to:'/accountManage'
  },
  {
    title: '清理缓存',
    value: '2.08MB',
    icon: require('@/assets/images/清理缓存.png'),
  },
  {
    title: '最新版本',
    value: '2.1.8',
    icon: require('@/assets/images/最新版本.png'),
  },
  {
    title: '用户协议',
    isLink: true,
    icon: require('@/assets/images/用户协议.png'),
    to: '/userProtocol',
  },
  {
    title: '修改手势密码',
    isLink: true,
    icon: require('@/assets/images/修改手势密码.png'),
    to:'/gestureLock'
  },
];

export default {
  data() {
    return {
      items,
      checked: true,
    };
  },
  methods: {
    goto(type) {
      let path = '';
      switch (type) {
        case 1: {
          // todo 需要查看当前用户是否登录
          path = '/countManager'; // 用户管理

          break;
        }
        case 2: {
          path = '/userProtocol'; // 用户协议
        }
      }

      this.$router.push(path);
    },
  },
};
</script>
<style lang="scss" scoped>
.item-icon {
  width: 17px;
  height: 19px;
  img {
    width: 100%;
  }
  margin-right: 10px;
}
.van-cell {
  background: transparent;
  color: #fff;
  font-size: 15px;
  padding: 20px 0 20px 7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.van-cell-group {
  background: transparent;
}
</style>
