<template>
  <div class="bg-1 flex-col vh100 reg">
    <van-nav-bar
      class="flex-none"
      title="注册"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="form ova">
      <van-field
        v-model="extensionCode"
        label="邀请码"
        placeholder="填写获得观影特权" />
      <van-field
        v-model="tel"
        label="+86 | 手机号"
        placeholder="请输入您的手机号码"
        required />
      <van-field
        v-model="smsCode"
        label="验证码"
        placeholder="请输入验证码"
        required>
        <van-button slot="button"
          size="small"
          type="primary"
          class="vcode-btn"
          @click.prevent="getSmsCode">{{computeTime>0 ? `${computeTime}秒` : '获取验证码'}}</van-button>
      </van-field>
      <van-field
        v-model="pwd"
        label="密码"
        type="password"
        placeholder="请输入密码"
        required />
      <van-field
        v-model="wx"
        label="微信号"
        placeholder="请输入微信号" />
      <van-field
        v-model="qq"
        label="QQ"
        placeholder="请输入QQ号" />
      <button class="btn"
        @click="register">注册</button>
      <van-checkbox class="mt16"
        checked-color="#9348FF"
        v-model="isAgree">已阅读同意<span @click.stop="$router.push('/userProtocol')">《用户许可协议》</span></van-checkbox>
      <p class="tc f18 fw400 wh mt38"
        @click="$router.push('/login')">已有账号？点此登录</p>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid';
import { getSmsCode, telRegedit } from '@/api';

export default {
  data() {
    return {
      extensionCode: undefined, //推广码
      tel: null, //手机号码
      computeTime: 0, // 计时的时间
      smsCode: null,
      pwd: null,
      isShowPwd: false, //是否显示验证码
      isAgree: true,
      deviceCode: null,
      showToast: false,
      showToastMsg: '',
      wx: undefined,
      qq: undefined,
    };
  },
  mounted() {},
  methods: {
    // 异步获取短信验证码
    async getSmsCode() {
      let regPhone = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      if (!regPhone.test(this.tel)) {
        Toast('请输入正确的手机号码');
        return;
      }
      // 如果当前没有计时
      if (!this.computeTime) {
        // 启动倒计时
        this.computeTime = 60;
        this.intervalId = setInterval(() => {
          this.computeTime--;
          if (this.computeTime <= 0) {
            // 停止计时
            clearInterval(this.intervalId);
          }
        }, 1000);
        // 发送ajax请求(向指定手机号发送验证码短信)
        let params = {
          tel: this.tel,
          type: 2,
        };
        const result = await getSmsCode(params);
        if (result.retCode !== '1') {
          this.computeTime = 0;
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        }
        Toast(result.retMsg);
      }
    },
    // 异步注册
    async register() {
      const { rightPhone, tel, smsCode, pwd, extensionCode, wx, qq } = this;
      if (!this.rightPhone) {
        Toast('请输入正确的手机号码');
      } else if (!/^\d{4}$/.test(smsCode)) {
        // 验证必须是4位数字
        Toast('请输入4位验证码');
      } else if (!/^[0-9a-zA-Z]{6,20}$/.test(pwd)) {
        Toast('请输入6-20位密码');
      } else if (!this.isAgree) {
        Toast('必须同意《用户许可协议》');
      } else {
        let params = {
          extensionCode,
          tel,
          smsCode,
          pwd,
          wx,
          qq,
          deviceCode: window.localStorage.getItem('deviceCode'),
        };
        // 发送ajax请求短信注册
        Toast.loading({
          message: '注册中...',
          loadingType: 'spinner',
          duration: 0,
          overlay: true,
          forbidClick: true,
        });
        let result = await telRegedit(params);
        if (result.retCode === '1') {
          Toast('注册成功');
          this.computeTime = 0;
          clearInterval(this.intervalId);
          localStorage.setItem('token', result.token);
          localStorage.setItem('loginType', result.loginType);
          this.$router.push('/home');
        } else {
          Toast(result.retMsg || result.msg);
          this.computeTime = 0;
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        }
      }
    },
    showPwd() {
      this.isShowPwd = !this.isShowPwd;
    },
  },
  computed: {
    rightPhone() {
      return /^1\d{10}$/.test(this.tel);
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  padding: 70px 35px 53px;
}
</style>
<style lang="scss">
.reg {
  .van-field__label {
    width: auto;
    margin-right: 10px;
  }
  .van-cell {
    display: flex;
    align-items: center;
  }
}
</style>
