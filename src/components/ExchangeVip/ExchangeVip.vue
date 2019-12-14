<template>
  <div>
    <div class="black">
      <div class="earn" v-for="(item,index) in exchangeVipTypes" :key="index">
        <div class="bg"><img :src="item.icon"><img></div>
        <div class="detail">
          <div class="everyday">
            <span class="here">{{item.dayNumber}}天vip特权</span>
          </div>
          <div class="note" >{{item.integralNumber}}积分</div>
        </div>
        <div class="finish" v-show="integralNumber>=item.integralNumber"><button @click="ex(item.id)">立即兑换</button></div>
        <div class="unFinish" v-show="!(integralNumber>=item.integralNumber)"><button >积分不足</button></div>
        <div class="clear"></div>
      </div>
    </div>
    <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="showToastMsg"  position="buttom"></toast>
  </div>
</template>

<script>
  import {Toast} from 'vux'
  import {exchangeVip} from '../../api'

  export default {
    components:{
      Toast
    },
    props: {
      exchangeVipTypes: Array,
      integralNumber: Number,
      showToastMsg:'',
      showToast: false,
      getExchangeVipTypes:Function
    },methods:{
      ex(id){
        this.exchangeVip(id)
      },
      async exchangeVip(id){

        const result =  await exchangeVip(id)
        if(result.retCode==='1'){
          this.showToastMsg = '兑换成功';
          this.showToast = true;
          this.getExchangeVipTypes();

        }else{
          this.showToastMsg = result.retMsg
          this.showToast = true
        }

        this.$vux.toast.text(result.retMsg, 'bottom')

      }
    }
  }
</script>

<style scoped>
  .empty{
    width: 100%;
    background-color: #000000;
  }

  .earn:before,
  .earn:after{
    content: "";
    display: table;
    clear: both;
  }
  .earn{

    margin-bottom:1rem ;
    width: 100%;
    height:6rem;
    /*border: .1rem solid;*/
    background:#000000 ;
  }
  .earn .bg{
    float: left;
    width: 20%;
    margin-top: 0.5rem;
    margin-left:0.6rem ;
  }
  .earn> .bg img{
    width: 5rem;
  }
  .earn> .detail {
    width:40% ;
    margin-left:7rem;
    margin-top:1rem ;

  }
  .earn> .detail .note{
    width: 100%;
    font-size: .02rem;
  }
  .earn .everyday{
    margin-bottom:0.2rem ;
  }
  .earn .everyday .here{
    color: white;

  }
  .earn .everyday .num{
    color: #D5B771;
  }
  .earn .detail .note{
    color: #D5B771;

  }
  .earn .finish{
    float: right;
    margin-top:-2rem ;
    margin-right:1.2rem;
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border-radius: 2rem;
    border:.1rem solid #D5B771;
    color: #D5B771;
    background-color:#D5B771
  }

  .earn .unFinish{
    float: right;
    margin-top:-2rem ;
    margin-right:1.2rem;
    width: 6rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border-radius: 2rem;
    border:.1rem solid #D5B771;
    color: #D5B771;
    background-color:#999999
  }

  .earn> .finish button {
    border: none;
    outline: none;
    background-color:#D5B771 ;
    font-size: 0.8rem;
  }

  .earn> .unFinish button {
    border: none;
    outline: none;
    background-color:#999999 ;
    font-size: 0.8rem;
  }

  .black{
    background-color: #000000;
    height: 100%;
  }



</style>
