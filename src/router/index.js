import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    name: 'caricatureList',
    path: '/caricatureList',
    component: () => import('@/views/caricature'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
