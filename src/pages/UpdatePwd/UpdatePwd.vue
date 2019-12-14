<template>
  <div class="bg-1 flex-col vh100 forget-pwd">
    <van-nav-bar
      class="flex-none"
      title="忘记密码"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="form ova">
      <van-field
        v-model="tel"
        label="+86 | "
        placeholder="请输入手机号" />
      <van-field
        v-model="smsCode"
        label="验证码"
        placeholder="请输入验证码"
        required>
        <van-button slot="button"
          size="small"
          type="primary"
          class="vcode-btn">获取验证码</van-button>
      </van-field>
      <van-field
        v-model="pwd"
        :type="isShowPwd ? 'text':'password'"
        :right-icon="isShowPwd ? 'eye-o':'closed-eye'"
        @click-right-icon="isShowPwd = !isShowPwd"
        placeholder="请输入密码" />
      <button class="btn"
        @click="updatePwd">完成</button>
    </div>
  </div>
</template>

<script>
import { getSmsCode, loseTel } from '@/api';
export default {
  data() {
    return {
      computeTime: 0, // 计时的时间
      smsCode: null,
      pwd: null,
      isShowPwd: false, //是否显示密码
      deviceCode: null,
      showToast: false,
      showToastMsg: '',
      tel: null,
    };
  },
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
        if (result.retCode === '1') {
          // 显示提示
          Toast('发送成功');
        } else {
          Toast(result.retMsg);
          this.computeTime = 0;
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        }
      }
    },
    async updatePwd() {
      const { rightPhone, tel, smsCode, pwd } = this;
      let regPhone = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      if (!regPhone.test(this.tel)) {
        Toast('请输入正确的手机号码');
        return;
      } else if (!/^\d{4}$/.test(smsCode)) {
        // 验证必须是4位数字
        Toast('请输入4位验证码');
        return;
      } else if (!/^[0-9a-zA-Z]{6,20}$/.test(pwd)) {
        Toast('请输入6-20位密码');
      }
      let params = {
        tel: tel,
        smsCode: smsCode,
        pwd: pwd,
      };

      // 发送ajax请求短信登陆
      Toast.loading({
        message: '请稍候...',
        loadingType: 'spinner',
        duration: 0,
        overlay: true,
        forbidClick: true,
      });
      let result = await loseTel(params);
      if (result.retCode === '1') {
        Toast('修改成功');
        this.computeTime = 0;
        clearInterval(this.intervalId);
        this.$store.dispatch('saveUserToken', { token: result.token });
        this.$store.dispatch('saveUserloginType', {
          loginType: result.loginType,
        });

        this.$router.push(`/home`);
      } else {
        Toast(result.retMsg);
        this.computeTime = 0;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
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
  padding: 187px 35px 53px;
}
</style>
<style lang="scss">
.forget-pwd {
  .van-field__label {
    width: 55px;
  }
}
</style>
