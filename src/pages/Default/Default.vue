<template>
  <div>
    <Sticky>
      <x-header :left-options="{showBack: false}">
        <a slot="left" @click="back">
          返回
        </a>
      </x-header>
      <div class="container">
        页面不见了
      </div>
    </Sticky>

  </div>

</template>

<script>
  import { XHeader, Sticky } from 'vux'

  export default {
    components:{
      XHeader, Sticky
    },methods:{
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="less">

  .container {
    position: relative;
  }
  .content {
    position: absolute;
    margin: auto;
    top: 0; left: 0; bottom: 0; right: 0;
  }

</style>
