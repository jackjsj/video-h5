<template>
  <div class="bg-3 flex-col vh100">
    <van-nav-bar
      class="flex-none bgwh1"
      title="邀请好友下载免费领取vip"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="flex-auto flex-col banner-bg" :style="`background-image:url(${banner.picUrl});`">
      <div class="flex-none invite-bg">
        <div class="box bgwh flex aic">
          <div class="qrcode-wrapper flex jcc ovh mr15">
            <van-image v-if="qrImgSrc" :src="qrImgSrc" />
            <div id="down" style="display: none;"></div>
          </div>
          <div>
            <p class="f14 mb10 lh28 fw500">立即扫码</p>
            <p class="f14 lh28 fw400">填写我的邀请码</p>
            <p class="f18 lh28 fw500">{{memberInfo.extensionCode}}</p>
          </div>
        </div>
        <div class="btn-group flex aic f18 wh fw400">
          <p class="flex1 tc btn-item"
            style="border-right:1px solid rgba(255,255,255,.2)"
            @click="savePic">保存二维码</p>
          <p class="flex1 tc btn-item"
            @click="copyLink">复制链接</p>
        </div>
      </div>
    </div>
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
      memberInfo: {},
      qrImgSrc: '',
    };
  },
  mounted() {
    this.getExtensionCode();
    this.getBanner();
    this.memberInfo = JSON.parse(localStorage.getItem('memberInfo')) || {};
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
          this.qrImgSrc = url;
          var a = document.createElement('a');
          a.href = url;
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
          this.qrImgSrc = url;
          var a = document.createElement('a');
          a.href = url;
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
  border-radius: 50px;
  background: linear-gradient(90deg, #e95aa0, #a769ff);
  margin: 0 35px;
  box-shadow: 0px 30px 40px 40px rgba(0, 0, 0, 0.4);
}
.invite-bg {
  background: url(~@/assets/images/invite-bg.png);
  height: 285px;
  background-size: cover;
}
.box {
  margin: 45px 37px 30px;
  height: 134px;
  border-radius: 9px;
  padding: 13px 15px;
  box-sizing: border-box;
}
.qrcode-wrapper {
  width: 109px;
  height: 109px;
  background: rgba(216, 216, 216, 1);
  border-radius: 9px;
  border: 1px solid rgba(151, 151, 151, 1);
}
.banner-bg{
  justify-content: flex-end;
  background-size:100% 100%;
}
</style>
