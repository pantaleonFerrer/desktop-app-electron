import { createRouter, createWebHistory } from 'vue-router';
import AppsView from '../views/AppsView.vue';
import HomeView from '../views/HomeView.vue';
import UsersView from '../views/UsersView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/apps',
      name: 'apps',
      component: AppsView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
  ],
});

export default router;
