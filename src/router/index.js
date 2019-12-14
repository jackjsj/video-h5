import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/pages/Home/Home';
import Banner from '@/pages/Banner/Banner';
import Star from '@/pages/Star/Star';
import RankingList from '../pages/RankingList/RankingList';
import CaricatureList from '../pages/Caricature/CaricatureList/CaricatureList';
import MovieClassifyList from '../pages/MovieClassifyList/MovieClassifyList';
import MovieTagList from '../pages/MovieTagList/MoiveTagList';
import CaricaturePictureList from '../pages/Caricature/CaricaturePictureList/CaricaturePictureList';
import CaricatureDetails from '../pages/Caricature/CaricatureDetails/CaricatureDetails';
import MovieSearch from '../pages/MovieSearch/MovieSearch';
import Login from '../pages/Login/Login';
import SetUp from '../pages/SetUp/SetUp';
import UserProtocol from '../pages/UserProtocol/UserProtocol';
import MyCaricature from '../pages/Caricature/MyCaricature/MyCaricature';
import ViewHistory from '../pages/ViewHistory/ViewHistory';
import MyCollections from '../pages/MyCollections/MyCollections';
import CaricatureSearch from '../pages/Caricature/CaricatureSearch/CaricatureSearch';
import VipInfoDetails from '../pages/VipInfoDetails/VipInfoDetails';
import PersonalCenter from '../pages/PersonalCenter/PersonalCenter';
import Register from '../pages/Register/Register';
import UpdatePwd from '../pages/UpdatePwd/UpdatePwd';
import store from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: 'index',
      path: '/',
      redirect: '/home',
      meta: {
        keepAlive: true,
      },
      component: () => import('@/pages/index'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home,
          meta: {
            keepAlive: true,
          },
        },
        {
          path: '/Banner',
          name: 'banner',
          component: Banner,
        },
        {
          path: '/star',
          name: 'star',
          component: Star,
        },
        {
          path: '/rankingList',
          name: 'rankingList',
          component: RankingList,
        },
        {
          path: '/caricatureList',
          name: 'caricatureList',
          component: CaricatureList,
        },
        {
          path: '/personalCenter',
          name: 'personalCenter',
          component: PersonalCenter,
        },
      ],
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/pages/User/User'),
    },

    {
      path: '/video/:videoId',
      name: 'video',
      component: () => import('@/pages/Video/Video'),
    },
    // {
    //   path: "/movieClassifyList/:classifyId/:classifyIndex/:orderType",
    //   name: "MovieClassifyList",
    //   component: MovieClassifyList
    // },
    {
      path: '/movieClassifyList',
      name: 'MovieClassifyList',
      component: MovieClassifyList,
    },
    {
      path: '/offlineCache',
      name: 'offlineCache',
      component: () => import('@/pages/PersonalCenter/OfflineCache'),
    },
    {
      path: '/starDetail',
      name: 'starDetail',
      component: () => import('@/pages/Star/StarDetail'),
    },
    {
      path: '/movieTagList/:tagId/:tagName',
      name: 'MovieClassifyList1',
      component: MovieTagList,
    },
    {
      path: '/caricatureChapterNum/:id',
      name: 'CaricatureChapter',
      component: () => import('@/pages/Caricature/CaricatureChapterNum/CaricatureChapterNum'),
    },
    {
      path: '/caricaturePictureList/:chapterId',
      name: 'caricaturePictureList',
      component: CaricaturePictureList,
    },
    {
      path: '/caricatureDetails/:caricatureId',
      name: 'caricatureDetails',
      component: CaricatureDetails,
    },
    {
      path: '/movieSearch',
      name: 'search',
      component: MovieSearch,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/myCaricature',
      name: 'myCaricature',
      component: MyCaricature,
    },
    {
      path: '/viewHistory',
      name: 'viewHistory',
      component: ViewHistory,
    },
    {
      path: '/myCollections',
      name: 'myCollections',
      component: MyCollections,
    },
    {
      path: '/setUp',
      name: 'setUp',
      component: SetUp,
    },
    {
      path: '/userProtocol',
      name: 'userProtocol',
      component: UserProtocol,
    },
    {
      path: '/caricatureSearch',
      name: 'caricatureSearch',
      component: CaricatureSearch,
    },
    {
      path: '/vipCreditAdd',
      name: 'vipCreditAdd',
      component: () => import('@/pages/VipInfoDetails/VipCreditAdd'),
    },
    {
      path: '/vipInfoDetails/:showType',
      name: 'vipInfoDetails',
      component: VipInfoDetails,
    },
    {
      path: '/accountManage',
      name: 'accountManage',
      component: () => import('@/pages/AccountManage/AccountManage'),
    },
    {
      path: '/integralDetail',
      name: 'integralDetail',
      component: () => import('@/pages/VipInfoDetails/IntegralDetail'),
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/invitation',
      name: 'Invitation',
      component: () => import('@/pages/Invitation/Invitation'),
    },
    {
      path: '/updatePwd',
      name: 'updatePwd',
      component: UpdatePwd,
    },
    {
      path: '/gestureLock',
      name: 'gestureLock',
      component: () => import('@/pages/PersonalCenter/GestureLock'),
    },
    {
      path: '/extendUser',
      name: 'extendUser',
      component: () => import('@/pages/ExtendUser/ExtendUser'),
    },
  ],
});

/**
 * 全局路由守卫
 */
router.beforeEach(async (to, from, next) => {
  const path = to.path;
  const loginType = localStorage.getItem('loginType');
  let resultSetting = store.state.Setting;
  let resultOpenPay = store.state.OpenPay;
  /**
   * 用户没有手机号登陆，点击账户管理跳转到登陆页面
   */
  if (path === '/accountManage' && loginType !== '1') {
    next('/login');
    return;
  }
  /**
   * 用户已经手机号登陆
   */
  if (path === '/login' && loginType === '1') {
    next('/personalCenter');
    return;
  }
  if (path === '/vipCreditAdd' && loginType !== '1') {
    next('/login');
    return;
  }
  if (path === '/vipInfoDetails/1' && loginType !== '1') {
    next('/login');
    return;
  }
  next();
  return;

  /**
   * 明星漫画页面做拦截处理
   */
  if (path === '/star' || path === '/caricatureList') {
    if (!resultSetting.data.caricatureModuleSetting || !resultSetting.data.starModuleSetting) {
      //不存在数据
      alert('功能未开放');
      next('/home');
      return;
    } else {
      if (
        resultSetting.data.caricatureModuleSetting.isEnable === '1' &&
        path === '/caricatureList'
      ) {
        /* console.log('可以跳转到漫画页面')*/
        next();
        return;
      } else if (resultSetting.data.starModuleSetting.isEnable === '1' && path === '/star') {
        /* console.log('可以跳转到明星页面')*/
        next();
        return;
      } else {
        alert('功能未开放');
        next('/home');
        return;
      }
    }
  }

  /**
   * 点击vip后台校验是否有购买功能
   */
  if (path === '/vipInfoDetails/1') {
    if (!(loginType === '1')) {
      return;
    }
    if (!resultOpenPay) {
      next('/home');
      return;
    } else if (resultOpenPay.isOpen === '0') {
      next('vipInfoDetails/2');
      return;
    }
  }
});

export default router;
