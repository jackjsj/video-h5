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
        v-model="phoneNum"
        label="+86 | "
        placeholder="请输入您的手机号码" />
      <van-field
        v-model="password"
        :type="pwdVisible ? 'text':'password'"
        :right-icon="pwdVisible ? 'eye-o':'closed-eye'"
        @click-right-icon="pwdVisible = !pwdVisible"
        placeholder="请输入密码" />
      <button class="btn">登录</button>
      <div class="flex aic jcb mt16">
        <van-checkbox
          checked-color="#9348FF"
          v-model="remember">记住密码</van-checkbox>
        <p class="g9 f13 fw400"
          @click="$router.push('/forget-pwd')">忘记密码</p>
      </div>
      <p class="tc f18 fw400 wh mt143"
        @click="$router.push('/register')">新用户注册</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phoneNum: '',
      password: '',
      remember: false,
      pwdVisible: false,
    };
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
