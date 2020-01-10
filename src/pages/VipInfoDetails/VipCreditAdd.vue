<template>
  <!-- 会员充值 -->
  <div class="bg-2 flex-col vh100 vip-info-detail">
    <van-nav-bar
      class="flex-none"
      title="会员充值"
      left-arrow
      right-text="记录"
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="flex-auto ova content wh">
      <div class="card">
        <div class="flex aic mb20">
          <img src="" />
          <p>尊贵VIP</p>
          <p>无限次观看 | 无限次下载</p>
        </div>
        <div class="flex flex-wrap aic jcb">
          <div
            class="product-item flex-col jcc aic rel mb5"
            :class="{active:item.id === selected}"
            v-for="item in cardTypes"
            :key="item.id"
            @click="selected = item.id">
            <p>{{item.cardTypeName}}</p>
            <p>￥{{item.price}}</p>
            <!-- 左上赞 -->
            <div class="good" v-show="item.id === selected">
              <img src="@/assets/images/good.png" />
            </div>
            <!-- 右下勾 -->
            <div class="yes" v-show="item.id === selected">
              <img src="@/assets/images/yes.png" />
            </div>
          </div>
          <div class="card-pad"></div>
          <div class="card-pad"></div>
        </div>
        <div class="rel">
          <van-tabs
            v-model="tabActive"
            :border="false"
            title-active-color="#fff"
            title-inactive-color="#A7ADB6">
            <van-tab title="在线支付">
              <van-radio-group v-model="payWay">
                <van-cell-group :border="false">
                  <van-cell
                    v-for="item in payWays"
                    :key="item.name"
                    :title="item.name"
                    clickable
                    @click="payWay = item.name">
                    <template #icon>
                      <div class="pay-icon">
                        <img :src="item.icon" />
                      </div>
                    </template>
                    <van-radio slot="right-icon" :name="item.name" />
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
            </van-tab>
            <van-tab title="客服支付">
              <van-radio-group value="官方客服支付">
                <van-cell-group :border="false">
                  <van-cell
                    title="官方客服支付"
                    clickable>
                    <template #icon>
                      <div class="pay-icon">
                        <img src="@/assets/images/客服.png" />
                      </div>
                    </template>
                    <van-radio slot="right-icon" name="官方客服支付" />
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
              <div class="f13 opa7 fw400 lh21 pt15"
                style="border-top:1px solid rgba(255, 255, 255,.06)">
                <p>1.香蕉视频官方客服1V1充值服务，方便快捷；</p>
                <p>2.订单查询，可以查询未完成订单；</p>
                <p>3.提示：订单有时限，请联系官方客服获取有效充值方式，切勿直接转账</p>
              </div>
            </van-tab>
            <van-tab title="卡密兑换">
              <van-cell-group
                :border="false">
                <van-field v-model="vipCardPwd"
                  placeholder="请输入兑换码">
                  <template #left-icon>
                    <img class="vip-card-icon mr15" src="@/assets/images/兑换码.png" />
                  </template>
                </van-field>
              </van-cell-group>
            </van-tab>
          </van-tabs>
          <p class="abs tab-help flex aic f14" style="color:#A7ADB6"
            @click="toCustomerService">
            <van-icon name="question-o" />
            <span>充值帮助</span>
          </p>
        </div>
      </div>
      <div class="card flex aic jcb fw400">
        <div class="f16">付款未收到账？</div>
        <div class="f14 opa7 flex aic lh1"
          @click="toCustomerService">
          <span class="mr5">客服24小时内解决</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class="flex-none flex aic btn-group wh f14 fw400">
      <div class="flex1 tc btn-group-item"
        style="border-right:1px solid rgba(255, 255, 255, 0.2);"
        @click="toCustomerService">订单查询</div>
      <div class="flex1 tc btn-group-item"
        @click="toCustomerService">充值反馈</div>
      <div class="flex1 tc btn-group-item"
        @click="pay">{{tabActive === 2 ?'确认兑换':'确认支付'}}</div>
    </div>
    <van-dialog
      v-model="dialogVisible"
      confirmButtonText="知道了"
      @confirm="dialogVisible = false">
      <div class="flex-col aic">
        <div class="warn-icon">
          <img src="@/assets/images/warn.png" />
        </div>
        <!-- <p class="g0 mb8 f18 lh24">请下载app进行操作或使用客服支付</p> -->
        <p class="g0 mb20 f15">请下载app进行操作或使用客服支付</p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { getPayType, getVipList, getAcTurn, useRechargeCode } from '../../api';

const products = [
  {
    name: '2个月',
    price: '68',
  },
  {
    name: '3个月',
    price: '108',
  },
  {
    name: '6个月',
    price: '168',
  },
];

const payWays = [
  {
    name: '微信支付',
    icon: require('@/assets/images/微信支付.png'),
  },
  {
    name: '支付宝支付',
    icon: require('@/assets/images/支付宝支付.png'),
  },
  {
    name: '自动转账',
    icon: require('@/assets/images/自动转账.png'),
  },
];

export default {
  data() {
    return {
      payWays,
      payWay: '微信支付',
      selected: 1,
      payTypes: [],
      cardTypes: [],
      vipCardPwd: '',
      tabActive: 0,
      dialogVisible: false,
    };
  },
  async mounted() {
    this.qqUrl = localStorage.getItem('qqUrl');
    Toast.loading({
      message: '加载中...',
      loadingType: 'spinner',
      duration: 0,
      overlay: true,
    });
    await this.getVipList();
    Toast.clear();
    // this.getPayType();
  },
  methods: {
    toCustomerService() {
      this.$router.push('/personalCenter');
      window.location.href = this.qqUrl;
    },
    async pay() {
      this.toCustomerService();
      return;
      // uu版需要此功能
      if (this.tabActive === 2) {
        Toast.loading({
          message: '兑换中...',
          loadingType: 'spinner',
          duration: 0,
          overlay: true,
        });
        // 兑换卡密
        const result = await useRechargeCode(this.vipCardPwd);
        if (result.retCode === '1') {
          this.vipCardPwd = '';
        }
        Toast(result.retMsg);
      } else if (this.tabActive === 1) {
        this.toCustomerService();
      } else {
        // 弹出提示
        // 请下载app进行操作或使用客服支付
        this.dialogVisible = true;
        // Toast.loading({
        //   message: '跳转中...',
        //   loadingType: 'spinner',
        //   duration: 0,
        //   overlay: true,
        // });
        // const result = await getAcTurn();
        // if (result.retCode === '1') {
        //   setTimeout(() => {
        //     Toast.clear();
        //     window.open(
        //       result.data.turn_url.startsWith('http')
        //         ? result.data.turn_url
        //         : `http://${result.data.turn_url}`,
        //       '_blank',
        //     );
        //   }, 500);
        // } else {
        //   Toast(result.retMsg);
        // }
      }
    },
    async getPayType() {
      const result = await getPayType();
      if (result.retCode === '1') {
        this.payTypes = result.data;
      } else {
        this.$router.push('/personalCenter');
      }
    },
    async getVipList() {
      const result = await getVipList();
      if (result.retCode === '1') {
        this.cardTypes = result.data;
      } else {
        this.$router.push('/personalCenter');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  height: 50px;
  background: rgba(27, 24, 46, 1);
}
.btn-group-item {
  height: 29px;
  line-height: 29px;
  &:active {
    opacity: 0.7;
  }
  &:last-child {
    height: 50px;
    line-height: 50px;
    background: linear-gradient(#e95aa0, #a769ff);
  }
}
.content {
  padding: 20px 15px;
}
.card {
  background: rgba(27, 24, 46, 1);
  border-radius: 9px;
  padding: 15px 18px;
  margin-bottom: 15px;
}
.product-item {
  width: 100px;
  height: 88px;
  border-radius: 13px;
  border: 1px solid #ee80b6;
  transition: all 0.5s;
  &.active {
    background: rgba(238, 128, 182, 0.1);
  }
}
.card-pad {
  width: 100px;
}
.van-cell-group {
  background: transparent;
}
.van-cell {
  background: transparent;
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  padding: 15px 0;
}
.van-cell:not(:last-child)::after {
  border-color: rgba(255, 255, 255, 0.06);
}
.pay-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  img {
    width: 100%;
  }
}
.good {
  position: absolute;
  width: 23px;
  height: 16px;
  top: -1px;
  left: -1px;
  img {
    width: 100%;
  }
}
.yes {
  position: absolute;
  width: 23px;
  height: 22px;
  bottom: -1px;
  right: -1px;
  img {
    width: 100%;
  }
}
.van-radio {
  flex: none;
  margin-right: 10px;
}
.tab-help {
  top: 15px;
  right: 0;
}
.vip-card-icon {
  width: 20px;
}
.warn-icon {
  width: 70px;
  height: 70px;
  margin-top: 28px;
  margin-bottom: 16px;
  img {
    width: 100%;
  }
}
</style>
<style lang="scss">
.vip-info-detail {
  .van-tabs__nav {
    background: transparent;
  }
  .van-tab.van-tab--active {
    background: transparent;
    border-radius: 0;
    font-size: 19px;
    font-weight: 600px;
  }
  .van-tab {
    flex: none;
    margin-right: 15px;
    padding: 0;
  }
  .van-tabs__line {
    background: linear-gradient(90deg, #e95aa0, #a769ff);
    width: 76px !important;
  }
  .van-tabs__wrap {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 20px;
  }
  .van-radio__icon .van-icon {
    border-color: #666;
  }
  .van-radio__icon--checked .van-icon {
    background: #b000ba;
    border-color: #b000ba;
  }
}
</style>
