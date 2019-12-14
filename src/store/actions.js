/*
通过mutation间接更新state的多个方法的对象
*/

import {
  RECEIVE_USER_TOKEN,
  DELETEUSERTOKEN,
  RECEIVE_USER_LOGINTYPE,
  RECEIVE_OPENPAY,
  RECEIVE_SETING,
  RECEIVE_USER_ID} from './mutation-types'


export default {
  /**
   * 保存用户登录token
   */
  saveUserToken({commit},data){
    commit(RECEIVE_USER_TOKEN,data)
  },

  /**
   * 删除用户登录token
   */
  deleteUserToken({commit}){
    console.log('---')
    commit(DELETEUSERTOKEN)
  },

  /**
   * 保存用户登录类型
   * @param commit
   * @param data
   */
  saveUserloginType({commit},data){
    commit(RECEIVE_USER_LOGINTYPE,{loginType: data.loginType})
  },

  saveUserSeting({commit},data){
    commit(RECEIVE_SETING,{seting: data.seting})
  },


  saveUserOpenPay({commit},data){
    commit(RECEIVE_OPENPAY,{openpay: data.openpay})
  },

  /**
   * 保存用户id
   */
  saveUserId({commit},userId){
    commit(RECEIVE_USER_ID,{userId})
  }
}

