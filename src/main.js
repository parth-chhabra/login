import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueCookies from 'vue-cookies';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import App from './App.vue';
import router from './router';

Vue.use(VueMaterial);
Vue.use(VueCookies);

new Vue({
  router,
  render: (h) => h(App),
  el: '#app',
});