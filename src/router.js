import Vue from 'vue';
import Router from 'vue-router';
import Main from './views/Main.vue';
import Create from './views/Create.vue';
import Game from './views/Game.vue';
import Options from './views/Options.vue';
import MapView from './views/MapView.vue';
import Interface from './views/Interface.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
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
    {
      path: '/mapview',
      name: 'mapview',
      component: MapView,
    },
    {
      path: '/interface',
      name: 'interface',
      component: Interface,
    },
  ],
});
