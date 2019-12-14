// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/assets/styles/utils.css';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './vantComponent';
import 'video.js/dist/video-js.css';
import '@/assets/styles/override.scss';
import '@/assets/styles/animate.css';

import VueVideoPlayer from 'vue-video-player';
import VueClipboard from 'vue-clipboard2';
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
