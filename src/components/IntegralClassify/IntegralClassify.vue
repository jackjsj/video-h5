<template>
  <div>
    <div class="black">
      <div class="earn" v-for="(item,index) in integralClassifies" :key="index">
        <div class="bg"><img :src="item.icon"><img></div>
        <div class="detail">
          <div class="everyday">
            <span class="here">{{item.name}}</span>
            <span class="num">+{{item.number}}</span>
          </div>
          <div class="note" >{{item.integral_desc}}</div>
        </div>
        <div class="finish" @click="goFinish(item.id)" v-show="!item.isAccomplish">
          <button>去完成</button>
        </div>
        <div class="unFinish" v-show="item.isAccomplish">
          <button>已完成</button>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="showToastMsg"  position="buttom"></toast>
  </div>
</template>

<script>
  import {Toast} from 'vux'
  import {checkInAddIntegral} from '../../api'

  export default {
    components:{
      Toast
    },
    data(){
      return {
        showToastMsg:'',
        showToast: false,
        width: screen.availWidth,
        height: screen.availHeight,
      }
    },
    props: {
      integralClassifies: Array,
      integralNumber: Number,
      getIntegralClassifies:Function
    },methods:{
      goFinish(id){
        console.log(id)

        /* this.addIntegral(id)*/
        switch (id) {
          case 1:this.addIntegral(id);break;
          /*跳转路由邀请好友*/
          case 2: this.$router.push('/invitation');break;
          /*跳转到首页*/
          case 3: this.$router.push('/home'); break;
          /*跳转到下载链接*/
          case 4: window.location.href='https://qqsp.app/';break;
          /*跳转路由邀请好友*/
          case 5:this.$router.push('/invitation'); break;
            /*登录*/
          case 6:this.$router.push('/login'); break;

          case 7:this.addIntegral(id);break;

        }
      },
      async addIntegral(id){
        const result = await checkInAddIntegral(id)
        if(result.retCode==='1'){
          this.showToastMsg = '任务完成'
          this.showToast = true
          this.getIntegralClassifies()
        }else{
          this.showToastMsg = '任务失败'+result.retMsg
          this.showToast = true
        }
      }
    }
  }
</script>

<style scoped>

  /*.detail:before,
  .detail:after{
    content: "";
    display: table;
    clear: both;
  }*/

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
    width: 5.5rem;
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
    width: 5.5rem;
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
    font-size:0.8rem;
  }

  .black{
    background-color: #000000;
    height: 100%;
  }
</style>
