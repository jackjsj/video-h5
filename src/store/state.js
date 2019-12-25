/*
状态对象模块
*/
export default {
  token: localStorage.getItem('token') || '', // 用户登录token
  loginType: '', // 用户登录类型 1手机号登录 2自动登录
  Setting: Object,
  OpenPay: Object,
  userId: 0, // 用户id
  noticeShowed: false,
  isAuthLogin: false,
};
