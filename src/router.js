import Vue from 'vue';
import Router from 'vue-router';
import Menu from './views/Menu.vue';
import Game from './views/Game.vue';
import Options from './views/Options.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'menu',
      component: Menu,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
    {
      path: '/options',
      name: 'options',
      component: Options,
    },
  ],
});
