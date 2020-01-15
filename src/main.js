import '@/assets/styles/animate.css';
import '@/assets/styles/utils.css';
import 'video.js/dist/video-js.css';
import Vue from 'vue';
import VueVideoPlayer from 'vue-video-player';
import VueClipboard from 'vue-clipboard2';
import App from './App';
import store from './store';
import router from './router';
import './vantComponent';
import '@/assets/styles/override.scss';
import '@/assets/styles/theme/white.scss';

const hls = require('videojs-contrib-hls');
Vue.use(VueClipboard)
  .use(hls)
  .use(VueVideoPlayer);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store,
});
