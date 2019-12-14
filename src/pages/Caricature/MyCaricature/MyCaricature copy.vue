<template>
  <div>
    <Sticky>
      <x-header  :left-options="{backText: ''}"><span style="color: #FFFFFF">我的书架</span><a slot="right" @click="showSelect">{{menu}}</a></x-header>
    </Sticky>
    <flexbox :gutter="0" wrap="wrap" v-for="(caricature,index) in caricatures" :key="index">
      <flexbox-item  v-show="isSelect" :span="leftPer"><div class="flex-demo">
        <div class="mui-checkbox-con">
          <label>
            <input class="mui-checkbox checkbox-orange" type="checkbox" @click="selectDelItem(caricature.id)"  :checked="myAllSelect" :disabled="myAllSelect"></label>
        </div>
      </div></flexbox-item>
      <flexbox-item :span="midPer"><div class="flex-demo">
        <img class="cariImg" :src="caricature.cover" alt="">
      </div></flexbox-item>
      <flexbox-item :span="rightPer">
        <div class="flex-demo">{{caricature.caricatureName}}</div>
      </flexbox-item>
    </flexbox>
    <flexbox :gutter="0" wrap="wrap"  :key="index">
      <flexbox-item>
        <div class="flex-demo" v-show="caricatures.length<=0">
          <br>
          <br>
          <br>
          暂无记录
        </div>
      </flexbox-item>
    </flexbox>
    <div class="footerCaricature" v-show="isSelect">
      <tabbar>
        <tabbar-item @on-item-click="selectAll">
          <span slot="label" class="carMenu">{{bottomMenu1}}</span>
        </tabbar-item>
        <tabbar-item @on-item-click="deleteSelected">
          <span slot="label" class="carMenu" style="color: red">删除</span>
        </tabbar-item>
      </tabbar>
    </div>



    <toast v-model="showToast" type="text" :time="1000" is-show-mask :text="showToastMsg"  position="buttom"></toast>


  </div>
</template>

<script>
  import { XHeader,Flexbox, FlexboxItem,XSwitch,Group,InlineXSwitch,Radio,Tabbar, TabbarItem,Toast,Sticky  } from 'vux'
  import {getCaricatureBookcaseList,delCaricatureBookcase} from '../../../api'

  export default {
    data(){
      return{
        isSelect:false,
        leftPer:0,
        midPer:1/2,
        rightPer:1/2,
        menu:'编辑',
        bottomMenu1: '全选',
        myAllSelect:false,
        radio001: 'a',
        deleteItem:[],
        deleteItemFlag:false,
        caricatures:[],
        showToast: false,
        showToastMsg: ''

      }
    },
    components: {
      XHeader,
      FlexboxItem,
      Flexbox,
      XSwitch,
      Group,
      InlineXSwitch,
      Radio,
      Tabbar,
      TabbarItem,
      Toast,
      Sticky
    },
    mounted(){
      this.getCaricatureBookcaseList({})
    },
    methods:{
      showSelect(){
        this.isSelect = !this.isSelect

        if(this.isSelect){
          this.leftPer = 1/7
          this.midPer = 3/7
          this.rightPer = 3/7
          this.menu = '完成'


        }else{
          this.menu = '编辑'
          this.leftPer = 0
          this.midPer = 1/2
          this.rightPer = 1/2
          this.myAllSelect = false
          this.deleteItem = []
          this.bottomMenu1 = '全选'
        }

      },
      selectAll(){
        this.myAllSelect=!this.myAllSelect

        if(this.myAllSelect){
          this.bottomMenu1 = '取消全选'
        }else{
          this.bottomMenu1 = '全选'
        }
        console.log('全选')
      },
      async deleteSelected(){ //点击删除
        var ids=new Array();//创建list集合
        //如果全选时删除
        if(this.myAllSelect){
          this.caricatures.forEach((caricature)=>{
            ids.push(caricature.caricatureId)
          })
        }else{
          this.deleteItem.forEach((value)=>{
            ids.push(value)
          })
        }

        console.log(this.myAllSelect)
        console.log(this.deleteItem.length)
        console.log(ids.length)

        /*
           不拦截
            全选
            没有全选时选中>0
        */

        if(!(this.myAllSelect||(!this.myAllSelect&&this.deleteItem.length>0))){
          //提示请选择要删除
          this.showToastMsg = '请选择'
          this.showToast = true
          return
        }

        let params =ids
        this.$vux.loading.show({
          text: '删除中'
        });
        const result = await  delCaricatureBookcase(params);
        if (result.retCode === '1') {
          this.$vux.loading.hide();
          this.showToastMsg = '删除了'+ids.length+'条记录'
          /*this.showToastMsg = '删除了选择的记录'*/
          this.showToast = true
          this.getCaricatureBookcaseList()

          //强制刷新页面
          //this.$forceUpdate();
          //location.reload()
          /*this.$router.go(0)*/
        }else{
          this.$vux.loading.hide();
          this.showToastMsg = '删除失败'
          this.showToast = true
        }


      },
      selectDelItem(id){   //选择单个删除
        //如果已经存在删除
        var isContains = false

        for(let i=0;i<this.deleteItem.length;i++){
          if(this.deleteItem[i]===id){
            this.deleteItem.splice(i, 1)
            isContains = true
          }
        }
        //不存在，添加
        if(!isContains){
          this.deleteItem.push(id)
        }

        console.log(this.deleteItem)
      },
      async  getCaricatureBookcaseList(params){
        this.$vux.loading.show({
          text: '加载中'
        });
        const result = await getCaricatureBookcaseList(params);
        if (result.retCode === '1') {

          this.caricatures = result.data.caricatureBookcaseList
        }else{
          this.$vux.loading.hide();
          this.showToastMsg = '加载失败'
          this.showToast = true
        }
        this.$vux.loading.hide();
      }
    }
  }
</script>

<style scoped>

  .cariImg{
    width: 100%;height: 8rem;margin: 0 ;border-radius:1rem 0 0 0;
  }

  .flex-demo {
    text-align: center;
    color: black;
    /*background-color: #20b907;*/
    /*border-radius: 4px;*/
    background-clip: padding-box;
  }

  /* 底部*/
  .footer{
   line-height: 1.8;
    z-index: 9999;
  }
  .footer tabbar {
    margin-top: 5rem;
    position: fixed;
    bottom: -8rem;
  }

  .footer tabbar a {
    font-size: 100%;
    display: block;
    text-align: center;
    color: floralwhite;

  }

  .footer tabbar a:hover{
    font: bold 14px Georgia;
    text-decoration: none;

  }
  .footerCaricature{
    width: 100%;
    position: fixed;
    bottom: 0;
  }
  .footerCaricature span{
    line-height: 2rem;
    z-index: 9999;
  }
  .footerCaricature a{
    text-decoration: none;
  }




  .carMenu{
    margin-bottom: -5rem;
    font-size: 15px;
  }


  /*checkbox美化*/
  .mui-checkbox {
    -webkit-appearance: none;
    position: relative;
    width: 25px;
    height: 25px;
    margin-right: 10px;
    background-color: #FFFFFF;
    border: solid 1px #d9d9d9;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-clip: padding-box;
    display: inline-block; }
  .mui-checkbox:focus {
    outline: 0 none;
    outline-offset: -2px; }
  .mui-checkbox:checked {
    background-color: #18b4ed;
    border: solid 1px #FFFFFF; }
  .mui-checkbox:checked:before {
    display: inline-block;
    margin-top: 1px;
    margin-left: 2px;
    /*font-family: iconfont;
    content: "\e667";*/
    color: #FFFFFF;
    font-size: 18px; }
  .mui-checkbox:disabled {
    background-color: #d9d9d9;
    border: solid 1px #d9d9d9; }
  .mui-checkbox:disabled:before {
    display: inline-block;
    margin-top: 1px;
    margin-left: 2px;
    /*font-family: iconfont;
    content: "\e667";*/
    color: #FFFFFF;
    font-size: 18px; }
  .mui-checkbox.checkbox-green:checked {
    background-color: #5cb85c; }
  .mui-checkbox.checkbox-orange:checked {
    background-color: #f0ad4e; }
  .mui-checkbox.checkbox-s {
    width: 19px;
    height: 19px; }
  .mui-checkbox.checkbox-s:before {
    display: inline-block;
    margin-top: 1px;
    margin-left: 2px;
    /* font-family: iconfont;
     content: "\e667";*/
    color: #FFFFFF;
    font-size: 13px; }

  .mui-checkbox-anim {
    -webkit-transition: background-color ease 0.2s;
    transition: background-color ease 0.2s; }
</style>
