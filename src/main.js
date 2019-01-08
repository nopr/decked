import Vue from 'vue';
import VueLodash from 'vue-lodash';
import VueKonva from 'vue-konva';

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';

import svgjs from './svgjs';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueLodash, { name: 'utility' });
Vue.use(VueKonva);
Vue.use(svgjs);

Vue.component('Icon', Icon);

Vue.config.productionTip = false;

new Vue({ router, store, render: h => h(App) }).$mount('#app');
