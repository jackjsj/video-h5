<template>
  <div class="myset">
    <x-header  :left-options="{backText: ''}" title="账户管理"></x-header>

    <group >
      <cell  title="头像" is-link>
        <span  style="font-size: 2.2rem" class="icon iconfont">&#xe77c;</span>
      </cell>
      <cell title="昵称" value="用户2179" is-link></cell>
      <cell title="性别" value="男" is-link></cell>
    </group>
    <div class="regist" @click="out"><button>退出登录</button></div>

    <div v-transfer-dom>
      <confirm v-model="isShowConfirmOut"
               title="提示"
               theme="android"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="onHide">
        <span style="font-size: 2.5rem" class="icon iconfont">&#xe864;</span>
        <span style="text-align:center;color: #B38855">是否要注销登录</span>
      </confirm>
    </div>
  </div>
</template>

<script>
  import { XHeader, Group, Cell, CellBox,Confirm,TransferDomDirective as TransferDom  } from 'vux'
  import {logout} from '../../api'
  export default {
    data(){
      return{
        isShowConfirmOut:false
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      Cell,
      CellBox,
      Confirm

    },
    methods:{
      out(){
        this.isShowConfirmOut = !this.isShowConfirmOut
      },
      async logout(){
        const result = await logout()
        console.log(result)
        if (result.httpCode===200){

          //token置为空
          this.$store.dispatch('deleteUserToken');
          this.$router.push('/home');
        }
      },onCancel(){
        console.log('onCancel')
      },onShow(){
        console.log('onShow')
      },onHide(){
        console.log('onHide')
      },onConfirm(){
        this.logout()
      },
    }
  }
</script>

<style scoped lang="less">
  .regist>button{
    width: 96%;
    border: 1px solid #B4854D;
    outline: none;
    border-radius: 2rem;
    margin:.6rem  ;
    line-height: 3rem;
    font-size: 1rem;
    color: #B4854D;
    background-color: #323232;
  }

</style>
