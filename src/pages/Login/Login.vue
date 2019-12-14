<template>
  <div class="bg-1 flex-col vh100 login">
    <van-nav-bar
      class="flex-none"
      title="登录"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="form ova">
      <van-field
        v-model="tel"
        label="+86 | "
        placeholder="请输入您的手机号码" />
      <van-field
        v-model="pwd"
        :type="pwdVisible ? 'text':'password'"
        :right-icon="pwdVisible ? 'eye-o':'closed-eye'"
        @click-right-icon="pwdVisible = !pwdVisible"
        placeholder="请输入密码" />
      <button class="btn"
        @click="login">登录</button>
      <div class="flex aic jcb mt16">
        <van-checkbox
          checked-color="#9348FF"
          v-model="isRememberPwd">记住密码</van-checkbox>
        <p class="g9 f13 fw400"
          @click="$router.push('/updatePwd')">忘记密码</p>
      </div>
      <p class="tc f18 fw400 wh mt143"
        @click="$router.push('/register')">新用户注册</p>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';

import { login, getBannerByCid } from '@/api';

export default {
  name: 'Login',
  data() {
    return {
      tel: '',
      pwd: '',
      isRememberPwd: true, //是否记住密码
      pwdVisible: false,
      bgPicture: 'http://pic.qqtn.com/up/2019-9/15688885641077558.jpg', //背景圖片
      width: screen.availWidth,
      height: screen.availHeight,
      banner: {},
    };
  },
  mounted() {
    // 初始化
    this.init();
  },
  methods: {
    init() {
      let userData = localStorage.getItem('userData');
      let decode = Base64.decode(userData);
      if (userData) {
        let { tel, pwd } = JSON.parse(decode);
        this.tel = tel;
        this.pwd = pwd;
      }
    },
    async login() {
      // 校验手机号
      let telReg = /^[1][3,4,5,7,8][0-9]{9}$/;

      if (!telReg.test(this.tel)) {
        Toast('请输入正确的手机号');
        return;
      }
      let loginParams = { tel: this.tel, pwd: this.pwd };
      // 发送请求登录
      Toast.loading({
        message: '登录中...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
        forbidClick: true,
      });
      const result = await login(loginParams);
      if (result.retCode === '1') {
        this.$store.dispatch('saveUserToken', {
          token: result.token,
          loginType: result.loginType,
        });
        localStorage.setItem('token', result.token);
        localStorage.setItem('loginType', result.loginType);
        // 查看是否保存用户名密码
        if (this.isRememberPwd) {
          // 保存账号密码
          let encode = Base64.encode(JSON.stringify(loginParams));
          // 写入localStorage
          localStorage.setItem('userData', encode);
          // 跳转路由
        }
        Toast.clear();
        this.$router.push('/');
      } else {
        Toast(result.retMsg || result.msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mt143 {
  margin-top: 143px;
}
.form {
  padding: 187px 35px 53px;
}
</style>
<style lang="scss">
.login {
  .van-field__label {
    width: 55px;
  }
}
</style>
