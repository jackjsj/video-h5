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
        v-model="inviteCode"
        label="邀请码"
        placeholder="填写获得观影特权" />
      <van-field
        v-model="phoneNum"
        label="+86 | 手机号"
        placeholder="请输入您的手机号码"
        required />
      <van-field
        v-model="vCode"
        label="验证码"
        placeholder="请输入验证码"
        required>
        <van-button slot="button"
          size="small"
          type="primary"
          class="vcode-btn"
          @click.prevent="getVCode">{{countDown>0 ? `${countDown}秒` : '获取验证码'}}</van-button>
      </van-field>
      <van-field
        v-model="password"
        label="密码"
        type="password"
        placeholder="请输入密码"
        required />
      <van-field
        v-model="wechat"
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
        v-model="isAgree">已阅读同意<span @click.stop="toAgreement">《用户许可协议》</span></van-checkbox>
      <p class="tc f18 fw400 wh mt38"
        @click="$router.push('/login')">已有账号？点此登录</p>
    </div>
  </div>
</template>

<script>
import uuid from 'uuid';
import { Toast } from 'vant';
import { getSmsCode, register } from '@/api/';

export default {
  data() {
    return {
      inviteCode: null,
      phoneNum: null,
      vCode: null,
      password: null,
      wechat: null,
      qq: null,
      isAgree: false,
      countDown: 0,
    };
  },
  methods: {
    //  跳转到协议页面
    toAgreement() {},
    // 获取验证码
    async getVCode() {
      if (!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(this.phoneNum)) {
        Toast('请输入正确的手机号码');
        return;
      }
      // 如果当前没有计时
      if (!this.countDown) {
        // 启动倒计时
        this.countDown = 60;
        this.intervalId = setInterval(() => {
          this.countDown--;
          if (this.computeTime <= 0) {
            // 停止计时
            clearInterval(this.intervalId);
          }
        }, 1000);
        // 发送ajax请求(向指定手机号发送验证码短信)
        const resp = await getSmsCode({
          tel: this.phoneNum,
          type: 2,
        });
        if (resp.retCode !== '1') {
          this.computeTime = 0;
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        }
        Toast(resp.retMsg);
      }
    },
    async register() {
      // 验证
      if (!/^1\d{10}$/.test(this.phoneNum)) {
        Toast('请输入正确的手机号码');
      } else if (!/^\d{4}$/.test(this.vCode)) {
        // 验证码必须是4位数字
        Toast('请输入4位验证码');
      } else if (!/^[0-9a-zA-Z]{6,20}$/.test(this.password)) {
        Toast('请输入6-20位密码');
      } else if (!this.isAgree) {
        Toast('必须同意《用户许可协议》才可注册！');
      } else {
        // 调注册接口
        const deviceCode = uuid();
        localStorage.setItem('deviceCode', deviceCode);
        const resp = await register({
          extensionCode: this.inviteCode,
          tel: this.phoneNum,
          smsCode: this.vCode,
          pwd: this.password,
          deviceCode,
        });
        Toast(resp.retMsg);
        this.computeTime = 0;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        if (resp.retCode === '1') {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('loginType', resp.loginType);
          this.$router.push('/home');
        }
      }
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
