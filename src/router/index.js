import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    name: 'index',
    path: '/',
    redirect: '/home',
    component: () => import('@/views/index'),
    children: [
      {
        name: 'caricatureList',
        path: 'caricatureList',
        component: () => import('@/views/caricature'),
      },
      {
        name: 'home',
        path: 'home',
        component: () => import('@/views/home'),
      },
      {
        name: 'banner',
        path: 'banner',
        component: () => import('@/views/banner'),
      },
      {
        name: 'star',
        path: 'star',
        component: () => import('@/views/star'),
      },
      {
        name: 'rank',
        path: 'rankingList',
        component: () => import('@/views/rank'),
      },
      {
        name: 'mine',
        path: 'personalCenter',
        component: () => import('@/views/mine'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
