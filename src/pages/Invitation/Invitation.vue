<template>
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none bgwh1"
      title="邀请好友下载免费领取vip"
      left-arrow
      right-text="记录"
      :border="false"
      @click-left="$router.back()"
      @click-right="$router.push('/extendUser')">
    </van-nav-bar>
    <div class="flex-auto ova flex aic jcc">
      <div id="qrcode" style=""></div>
      <div id="down" style="display: none;"></div>
    </div>
    <div class="flex-none flex aic btn-group wh f14">
      <p class="flex1 tc btn-item"
        style="border-right:1px solid rgba(255,255,255,.2)"
        @click="savePic">保存二维码</p>
      <p class="flex1 tc btn-item"
        @click="copyLink">复制链接</p>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import { getExtensionCode, checkInAddIntegral, getBannerByCid } from '@/api';

export default {
  data() {
    return {
      extensInfo: [],
      banner: {},
    };
  },
  mounted() {
    this.getExtensionCode();
    this.getBanner();
  },
  methods: {
    /**
     * 获取轮播图广告
     */
    async getBanner() {
      const result = await getBannerByCid(12);
      if (result.retCode === '1') {
        this.banner = result.data[0] || {};
      }
    },
    async getExtensionCode() {
      const params = {
        type: '1',
      };
      const result = await getExtensionCode(params);
      if (result.retCode === '1') {
        this.extensInfo = result;
      }
    },
    //保存图片
    savePic() {
      this.addIntegral(2);
      QRCode.toDataURL(this.extensInfo.extensionUrl)
        .then(url => {
          var qrbox = document.querySelector('#down');
          const img = new Image();
          img.src = url;
          qrbox.appendChild(img);
          var a = document.createElement('a');
          a.href = img.src;
          a.download = 'two-dimension';
          a.click();
        })
        .catch(err => {
          console.error(err);
        });
    },
    copyLink() {
      this.addIntegral(5);
      this.$copyText(this.extensInfo.extensionContext).then(
        e => {
          Toast('复制成功');
        },
        e => {
          Toast('复制失败,请重新点击保存');
        },
      );
    },
    async addIntegral(id) {
      const result = await checkInAddIntegral(id);
      if (result.retCode === '1') {
        Toast('任务完成');
        this.getIntegralClassifies();
      } else {
        // Toast('任务失败' + result.retMsg);
      }
    },
  },
  watch: {
    extensInfo(val) {
      QRCode.toDataURL(this.extensInfo.extensionUrl)
        .then(url => {
          var qrbox = document.querySelector('#qrcode');
          const img = new Image();
          img.src = url;
          qrbox.appendChild(img);
          var a = document.createElement('a');
          a.href = img.src;
        })
        .catch(err => {
          console.error(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-group {
  height: 50px;
  background: rgba(27, 24, 46, 1);
}
</style>
