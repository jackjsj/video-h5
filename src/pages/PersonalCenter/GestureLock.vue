<template>
  <div class="bg-2 flex-col vh100 reg">
    <van-nav-bar
      class="flex-none bgwh1"
      title="设置手势密码"
      left-arrow
      :border="false"
      @click-left="$router.back()">
    </van-nav-bar>
    <div class="flex-auto ova">
      <div class="gesturePwd">
        <div>
          <h4 ref="gestureTitle" class="gestureTitle">请绘制手势密码</h4>
          <canvas ref="canvas" style="background-color:transparent; display: inline-block;"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentValue: false,
      ctx: '',
      width: 0,
      height: 0,
      devicePixelRatio: 0,
      chooseType: '',
      r: '', // 公式计算
      lastPoint: [],
      arr: [],
      restPoint: [],
      pswObj: { step: 2 },
      canvas: '',
      value: true,
    };
  },
  created() {
    if (typeof this.value !== 'undefined') {
      this.currentValue = this.value;
    }
  },
  mounted() {
    this.setChooseType(3);
  },
  methods: {
    closePwd() {
      this.currentValue = false;
    },
    H5lock(obj) {
      this.height = obj.height;
      this.width = obj.width;
      this.chooseType =
        Number(window.localStorage.getItem('chooseType')) || obj.chooseType;
      this.devicePixelRatio = window.devicePixelRatio || 1;
    },
    drawCle(x, y) {
      // 初始化解锁密码面板 小圆圈
      this.ctx.strokeStyle = '#fff'; //密码的点点默认的颜色
      this.ctx.lineWidth = 0;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.r / 2.5, 0, Math.PI * 2, true);
      this.ctx.closePath();
      // this.ctx.stroke();
      this.ctx.fillStyle = '#fff';
      this.ctx.fill();
    },
    drawPoint(style) {
      // 初始化圆心
      for (var i = 0; i < this.lastPoint.length; i++) {
        this.ctx.fillStyle = style;
        this.ctx.beginPath();
        this.ctx.arc(
          this.lastPoint[i].x,
          this.lastPoint[i].y,
          this.r / 2.5,
          0,
          Math.PI * 2,
          true
        );
        this.ctx.closePath();
        this.ctx.fill();
      }
    },
    drawStatusPoint(type) {
      // 初始化状态线条
      for (var i = 0; i < this.lastPoint.length; i++) {
        this.ctx.strokeStyle = type;
        this.ctx.beginPath();
        this.ctx.arc(
          this.lastPoint[i].x,
          this.lastPoint[i].y,
          this.r,
          0,
          Math.PI * 2,
          true
        );
        this.ctx.closePath();
        this.ctx.stroke();
      }
    },
    drawLine(style, po, lastPoint) {
      //style:颜色 解锁轨迹
      this.ctx.beginPath();
      this.ctx.strokeStyle = style;
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);
      for (var i = 1; i < this.lastPoint.length; i++) {
        this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
      }
      this.ctx.lineTo(po.x, po.y);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    createCircle() {
      // 创建解锁点的坐标，根据canvas的大小来平均分配半径
      var n = this.chooseType;
      var count = 0;
      this.r = this.ctx.canvas.width / (2 + 4 * n); // 公式计算
      this.lastPoint = [];
      this.arr = [];
      this.restPoint = [];
      var r = this.r;
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          count++;
          var obj = {
            x: j * 4 * r + 3 * r,
            y: i * 4 * r + 3 * r,
            index: count,
          };
          this.arr.push(obj);
          this.restPoint.push(obj);
        }
      }
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      for (var i = 0; i < this.arr.length; i++) {
        this.drawCle(this.arr[i].x, this.arr[i].y);
      }
      //return arr;
    },
    getPosition(e) {
      // 获取touch点相对于canvas的坐标
      var rect = e.currentTarget.getBoundingClientRect();
      var po = {
        x: (e.touches[0].clientX - rect.left) * this.devicePixelRatio,
        y: (e.touches[0].clientY - rect.top) * this.devicePixelRatio,
      };
      return po;
    },
    update(po) {
      // 核心变换方法在touchmove时候调用
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      for (var i = 0; i < this.arr.length; i++) {
        // 每帧先把面板画出来
        this.drawCle(this.arr[i].x, this.arr[i].y);
      }
      this.drawPoint('#b000ba'); // 每帧花轨迹
      this.drawStatusPoint('#b000ba'); // 每帧花轨迹
      this.drawLine('#b000ba', po, this.lastPoint); // 每帧画圆心
      for (var i = 0; i < this.restPoint.length; i++) {
        if (
          Math.abs(po.x - this.restPoint[i].x) < this.r &&
          Math.abs(po.y - this.restPoint[i].y) < this.r
        ) {
          this.drawPoint(this.restPoint[i].x, this.restPoint[i].y);
          this.lastPoint.push(this.restPoint[i]);
          this.restPoint.splice(i, 1);
          break;
        }
      }
    },
    checkPass(psw1, psw2) {
      // 检测密码
      var p1 = '',
        p2 = '';
      for (var i = 0; i < psw1.length; i++) {
        p1 += psw1[i].index + psw1[i].index;
      }
      for (var i = 0; i < psw2.length; i++) {
        p2 += psw2[i].index + psw2[i].index;
      }
      return p1 === p2;
    },
    storePass(psw) {
      // touchend结束之后对密码和状态的处理
      if (this.pswObj.step == 1) {
        if (this.checkPass(this.pswObj.fpassword, psw)) {
          // this.pswObj.step = 2;
          this.pswObj.spassword = psw;
          this.$refs.gestureTitle.innerHTML = '密码保存成功';
          this.drawStatusPoint('#b000ba');
          this.drawPoint('#b000ba');
          Toast('密码保存成功');
          this.$router.back();
          // window.localStorage.setItem(
          //   'passwordxx',
          //   JSON.stringify(this.pswObj.spassword)
          // );
          // window.localStorage.setItem('chooseType', this.chooseType);
        } else {
          this.$refs.gestureTitle.innerHTML = '两次不一致，重新输入';
          this.drawStatusPoint('red');
          this.drawPoint('red');
          delete this.pswObj.step;
        }
      } else if (this.pswObj.step == 2) {
        if (this.checkPass(this.pswObj.spassword, psw)) {
          var gestureTitle = this.$refs.gestureTitle;
          gestureTitle.innerHTML = '解锁成功';
          this.drawStatusPoint('#b000ba'); //小点点外圈高亮
          this.drawPoint('#b000ba');
          this.drawLine(
            '#b000ba',
            this.lastPoint[this.lastPoint.length - 1],
            this.lastPoint
          ); // 每帧画圆心

          this.closePwd();
        } else if (psw.length < 4) {
          this.drawStatusPoint('red');
          this.drawPoint('red');
          this.drawLine(
            'red',
            this.lastPoint[this.lastPoint.length - 1],
            this.lastPoint
          ); // 每帧画圆心
          var gestureTitle = this.$refs.gestureTitle;
          gestureTitle.innerHTML = '请连接4个点';
        } else {
          this.drawStatusPoint('red');
          this.drawPoint('red');
          this.drawLine(
            'red',
            this.lastPoint[this.lastPoint.length - 1],
            this.lastPoint
          ); // 每帧画圆心
          var gestureTitle = this.$refs.gestureTitle;
          gestureTitle.innerHTML = '密码错误，您还可以输入N次';
        }
      } else {
        this.pswObj.step = 1;
        this.pswObj.fpassword = psw;
        this.$refs.gestureTitle.innerHTML = '再次输入';
      }
    },
    makeState() {
      if (this.pswObj.step == 2) {
        // this.$refs.updatePassword.style.display = 'block';
        var gestureTitle = this.$refs.gestureTitle;
        gestureTitle.innerHTML = '请解锁';
      } else if (this.pswObj.step == 1) {
        // this.$refs.updatePassword.style.display = 'none';
      } else {
        // this.$refs.updatePassword.style.display = 'block';
        // this.$refs.updatePassword.style.display  = 'block';
      }
    },
    setChooseType(type) {
      this.chooseType = type;
      this.init();
    },
    updatePassword() {
      window.localStorage.removeItem('passwordxx');
      window.localStorage.removeItem('chooseType');
      this.pswObj = {};
      this.$refs.gestureTitle.innerHTML = '绘制解锁图案';
      this.reset();
    },
    initDom() {
      this.chooseType = Number(window.localStorage.getItem('chooseType')) || 3;
      this.devicePixelRatio = window.devicePixelRatio || 1;
      var canvas = this.$refs.canvas;
      var width = this.width || 320;
      var height = this.height || 320;
      // 高清屏锁放
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.height = height * this.devicePixelRatio;
      canvas.width = width * this.devicePixelRatio;
    },
    init() {
      this.initDom();
      // this.pswObj = window.localStorage.getItem('passwordxx')
      //   ? {
      //       step: 2,
      //       spassword: JSON.parse(window.localStorage.getItem('passwordxx')),
      //     }
      //   : {};
      this.pswObj = {};
      this.lastPoint = [];
      this.makeState();
      this.touchFlag = false;
      this.canvas = this.$refs.canvas;

      this.ctx = this.canvas.getContext('2d');
      this.createCircle();
      this.bindEvent();
    },
    reset() {
      this.makeState();
      this.createCircle();
    },
    bindEvent() {
      var self = this;
      this.canvas = this.$refs.canvas;
      this.canvas.addEventListener(
        'touchstart',
        function(e) {
          e.preventDefault(); // 某些android 的 touchmove不宜触发 所以增加此行代码
          var po = self.getPosition(e);
          for (var i = 0; i < self.arr.length; i++) {
            if (
              Math.abs(po.x - self.arr[i].x) < self.r &&
              Math.abs(po.y - self.arr[i].y) < self.r
            ) {
              self.touchFlag = true;
              self.drawPoint(self.arr[i].x, self.arr[i].y);
              self.lastPoint.push(self.arr[i]);
              self.restPoint.splice(i, 1);
              break;
            }
          }
        },
        false
      );
      this.canvas.addEventListener(
        'touchmove',
        function(e) {
          if (self.touchFlag) {
            self.update(self.getPosition(e));
          }
        },
        false
      );
      this.canvas.addEventListener(
        'touchend',
        function(e) {
          if (self.touchFlag) {
            self.touchFlag = false;
            self.storePass(self.lastPoint);
            setTimeout(function() {
              self.reset();
            }, 1000);
          }
        },
        false
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.masks {
  text-align: center;
  position: relative;
}
.gesturePwd {
  height: 100%;
  text-align: center;
  overflow: hidden;
}
.gestureTitle {
  color: #fff;
  margin-top: 80px;
  font-size: 20px;
  font-weight: 600;
  font-weight: normal;
}
canvas {
  width: 320px;
  height: 320px;
  margin-top: 70px;
}
</style>
