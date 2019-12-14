<template>
  <div id="app" class="bg-2 vh100">
    <transition name="slide">
      <router-view v-if="$store.state.isAuthLogin" />
    </transition>
  </div>
</template>
<script>
import uuid from 'uuid';
import { authLogin, findIsOpenPay, getModuleSetting } from '@/api';
import { genLoginParams } from '@/utils/loginUtils';

export default {
  data() {
    return {};
  },
  mounted() {
    this.autoLogin();
  },
  methods: {
    /**
     * 自动登录
     */
    async autoLogin() {
      Toast.loading({
        message: '加载中...',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true,
      });
      let tokenOne = this.$store.state.token;
      if (!tokenOne && tokenOne.length <= 0) {
        // 从localStore中查询是否存在uuid
        let deviceCode = localStorage.getItem('deviceCode');
        let token = localStorage.getItem('token');
        if (!deviceCode) {
          // 存入uuid
          deviceCode = uuid();
          localStorage.setItem('deviceCode', deviceCode);
        }
        const loginParams = genLoginParams(deviceCode, token);
        const result = await authLogin(loginParams);
        if (result.retCode === '1' && result.token) {
          // 保存token到store中
          this.$store.dispatch('saveUserToken', {
            token: result.token,
            loginType: result.loginType,
          });
          // 保存token
          localStorage.setItem('token', result.token);
          // 保存通知列表
          const notice = result.noticeList[0] || {};
          localStorage.setItem('notice', JSON.stringify(notice));
        } else {
          //提示错误信息
          Toast(result.retMsg + 'token');
          return;
        }
        const resultSetting = await getModuleSetting();
        const resultOpenPay = await findIsOpenPay();
        if (resultSetting.retCode === '1') {
          this.$store.dispatch('saveUserSeting', { setting: resultSetting });
        } else {
          Toast(result.retMsg + 'setting');
          return;
        }

        if (resultOpenPay.retCode === '1') {
          this.$store.dispatch('saveUserOpenPay', { openpay: resultOpenPay });
        } else {
          Toast(result.retMsg + 'openPay');
          return;
        }
      }
      Toast.clear();
      this.$store.state.isAuthLogin = true;
    },
  },
};
</script>
<style>
</style>
