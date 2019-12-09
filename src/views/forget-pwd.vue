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
        v-model="phoneNum"
        label="+86 | "
        placeholder="请输入手机号" />
      <van-field
        v-model="vCode"
        label="验证码"
        placeholder="请输入验证码"
        required>
        <van-button slot="button"
          size="small"
          type="primary"
          class="vcode-btn">获取验证码</van-button>
      </van-field>
      <van-field
        v-model="password"
        :type="pwdVisible ? 'text':'password'"
        :right-icon="pwdVisible ? 'eye-o':'closed-eye'"
        @click-right-icon="pwdVisible = !pwdVisible"
        placeholder="请输入密码" />
      <button class="btn">完成</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phoneNum: '',
      vCode: '',
      password: '',
      pwdVisible: false,
    };
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
