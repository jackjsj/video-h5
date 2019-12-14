/*
直接更新state的多个方法的对象
*/
import {
  RECEIVE_USER_TOKEN,
  DELETEUSERTOKEN,
  RECEIVE_USER_LOGINTYPE,
  RECEIVE_OPENPAY,
  RECEIVE_SETING,
  RECEIVE_USER_ID
} from './mutation-types'

export default {
  [RECEIVE_USER_TOKEN](state,{token,loginType}){
    state.token = token;
    state.loginType = loginType;
  },
  [DELETEUSERTOKEN](state){
    console.log(state.token)
    state.token = '';
    state.loginType = '';

    console.log(state.token)
  },
  [RECEIVE_USER_LOGINTYPE](state,{loginType}){
    state.loginType = loginType;
  },
  [RECEIVE_SETING](state,{seting}){
    state.Setting = seting;
  },
  [RECEIVE_OPENPAY](state,{openpay}){
   state.OpenPay = openpay;
  },
  [RECEIVE_USER_ID](state,{userId}){
    console.log(userId)
    state.userId = userId;
  },

}
