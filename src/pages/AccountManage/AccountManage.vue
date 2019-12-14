<template>
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none bgwh1"
      title="帐户管理"
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
          :to="item.to"
          @click="onItemClick(item)">
          <template #icon>
            <div class="item-icon" v-show="item.icon">
              <img :src="item.icon" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { logout } from '@/api';

export default {
  data() {
    return {
      items: [
        {
          title: '头像',
          isLink: true,
        },
        {
          title: '昵称',
          value: '',
          isLink: true,
        },
        {
          title: '性别',
          value: '',
          isLink: true,
        },
        {
          title: '退出登录',
          value: '',
          isLink: true,
          onClick: () => {
            this.logout();
          },
        },
      ],
    };
  },
  methods: {
    onItemClick(item) {
      if (item.onClick) {
        item.onClick();
      }
    },
    async logout() {
      Toast.loading({
        message: '正在登出...',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true,
        overlay: true,
      });
      const result = await logout();
      if (result.httpCode === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('loginType');
        this.$router.push('/home');
        Toast.clear();
      } else {
        Toast(result.retMsg);
      }
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
