<template>
  <div>
    <x-button @click.native="showPosition('bottom')" type="primary">Bottom</x-button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {ToastPlugin} from 'vux'

  Vue.use(ToastPlugin)
  export default {
    name: "user",
    methods: {
      showPosition(position) {
        this.$vux.toast.show({
          type: 'text',
          text: 'test',
          position: 'bottom'
        })
      },
    }
  }
</script>

<style scoped>

</style>
