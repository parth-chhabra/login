import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';

import App from './App.vue';
import router from './router';

Vue.use(VueMaterial)

new Vue({
  router,
  render: (h) => h(App),
  el: '#app',
});