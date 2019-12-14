<template>
  <div class="ExtendUserContainer">
    <div>
      <x-header :left-options="{backText: ''}">我的推广</x-header>
    </div>
    <div class="extendUser">
      <div><span>用户名</span></div>
      <div><span>手机号</span></div>
      <div><span>注册时间</span></div>
    </div>
    <div class="userNameContainer" >
      <div  class="userInformation"  v-for="(item,index)  in extensions" :key="index">
        <div><span>{{item.nickName}}</span></div>
        <div><span>{{item.tel}}</span></div>
        <div><span>{{item.regeditTime}}</span></div>
      </div>
    </div>

  </div>
</template>

<script>
  import {XHeader} from 'vux'


  import {getExtensionHistory} from '../../api'

  export default {
    name: "ExtendUser",
    data(){
      return {
        extensions: []
      }
    },
    components: {
      XHeader
    },
    mounted() {
      this.getExtensionHistory();
    },
    methods: {
      async getExtensionHistory() {
        const result = await getExtensionHistory();

        if (result.retCode === '1') {
          this.extensions = result.data;
        }else{
          this.$vux.toast.text(result.retMsg, 'bottom')
        }

      }
    }
  }
</script>

<style scoped>
  .extendUser {
    width: 100%;
    height: 3rem;
    text-align: center;
    background: #EDEDED;
  }

  .extendUser div {
    width: 30%;
    display: inline-block;
    margin: 0 auto;
    background: #EDEDED;

  }

  .extendUser span {
    line-height: 3rem;
  }


  .userInformation {
    width: 100%;
    height: 3rem;
    text-align: center;
    border-bottom-style: solid;
    border-width: 0.05rem;
  }

  .userInformation div {
    width: 30%;
    display: inline-block;
    margin: 0 auto;

  }

  .userInformation span {
    line-height: 3rem;
  }

</style>
