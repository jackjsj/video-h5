<template>
  <div class="invitationBJ"
    :style="{backgroundImage:'url(' + banner.picUrl + ')'}"
  >
    <div class="page">
      <x-header  class="headerTop" >
        邀请好友下载免费领取vip
        <a slot="right" @click="$router.push('extendUser')">
          推广记录
        </a>
      </x-header>
      <div class="img">
        <!-- <img src="http://www.baidu.com" />-->
        <div id="qrcode" style=""></div>
        <div id="down" style="display: none;"></div>
      </div>
      <div class="bottom">
        <div >
          <span @click="savePic">保存二维码</span></div>
        <div>
          <span @click="copyLink">复制链接</span></div>
      </div>
    </div>
<!--    <div class="VipBlank" style="height: 20rem;">-->
<!--    </div>-->
  </div>
</template>

<script>
  import QRCode from 'qrcode'
  import {XHeader,ToastPlugin} from 'vux'
  import {getExtensionCode,checkInAddIntegral,getBannerByCid} from '../../api'


  export default {
    data(){
      return{
        extensInfo:[],
        banner: {}
      }
    },
    components: {
      XHeader
    },
    mounted() {
      this.getExtensionCode()
      this.getBanner();
    },
    methods:{
      /**
       * 获取轮播图广告
       */
      async getBanner(){

        const result = await getBannerByCid(12);

        if(result.retCode === '1'){
          this.banner = result.data[0] || {}
        }

      },
      async getExtensionCode(){

        const params = {
          'type':'1'
        }

        const  result = await getExtensionCode(params);
        if(result.retCode==='1'){
          this.extensInfo = result
        }

      },
      //保存图片
      savePic(){

        console.log('-----')
        this.addIntegral(2)
        QRCode.toDataURL(this.extensInfo.extensionUrl)
          .then(url => {
            var qrbox = document.querySelector("#down");
            const img = new Image();
            img.src=url;
            qrbox.appendChild(img);

            var a = document.createElement("a");
            a.href = img.src;
            a.download = 'two-dimension';
            a.click();


          })
          .catch(err => {
            console.error(err)
          })
      },
      copyLink(){

        this.addIntegral(5)

        this.$copyText(this.extensInfo.extensionContext).then( (e) =>{
          this.$vux.toast.text('复制成功', 'middle')
        },  (e) => {
          this.$vux.toast.text('复制失败,请重新点击保存', 'middle')
        })
      },
      async addIntegral(){
        const  id = 3
        const result = await checkInAddIntegral(id)
        if(result.retCode==='1'){
          this.showToastMsg = '任务完成'
          this.showToast = true
          this.getIntegralClassifies()
        }else{
          this.showToastMsg = '任务失败'+result.retMsg
          this.showToast = true
        }
      },
      checkIsFinishInter(id){  //返回false已经完成任务

      const nowDate = this.getNowTime()

      const inter = localStorage.getItem('IntegralFlag3');
      if(!inter&&inner.get('nowDate')===nowDate&&inner.get('id')===id){
        return false
      }else{
        return true
      }
      /*// this.addIntegral(3)
      const IntegralFlag = {
        'nowDate':nowDate,
        'id':id
      }*/
    },
      getNowTime(){
      let now = new Date()
      const year = now.getFullYear(); //得到年份
      const month = now.getMonth();//得到月份
      const date = now.getDate();//得到日期
      const addIntegralFlag = year+''+month+''+date
      return addIntegralFlag
    }

    },
    watch:{
      extensInfo(val){
        QRCode.toDataURL(this.extensInfo.extensionUrl)
          .then(url => {
            var qrbox = document.querySelector("#qrcode");
            const img = new Image();
            img.src=url;
            qrbox.appendChild(img);

            var a = document.createElement("a");
            a.href = img.src;

          })
          .catch(err => {
            console.error(err)
          })
      }
    },
  }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }


  .invitationBJ{
    width: 100%;
    height: 100%;
    overflow: hidden;
    -moz-background-size:100% 100%;
    background-size: cover;
    background-repeat:no-repeat;
    position: absolute;
    z-index: 1;
  }

  .header{
    width: 100%;
    height: 4rem;
    background-color: #000000;
  }
  .header> .content{
    text-align: center;
  }
  .header>.back{
    position: relative;
    top: 1.3rem;
    left: 1rem;
    color: #D5B771
  }
  .header >.content .my{
    line-height: 1.4rem;
    color: #D5B771 ;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .rem{
    position:absolute ;
    color: #D5B771;
    left: 83%;
    top:1.5rem;
    font-size: .8rem;
  }
  .bottom{
    position:fixed;
    width: 100%;
    height: 10%;
    bottom:0rem;
    background-color:#4B4B4B;

  }
  .page >.img{
    width: 100%;

    position: fixed;
  }
  .page>.img img{
    width: 100%;
    background-repeat: no-repeat;

  }
  .bottom  div{
    height: 100%;
    text-align: center;
    display: inline-block;
    width: 49%;
    line-height: 5rem;
    color: #D5B771;

  }
  .bottom div:not(:last-child){
    border-right:.1rem solid  white
  }

  #qrcode{
    width:8rem;
    height:8rem;
    position: fixed;
    bottom: 15rem;
    left: 6rem;
  }

</style>
