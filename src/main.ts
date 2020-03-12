import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Axios from 'axios';

import Title from '@/components/Title.vue'

Vue.component('title-element', Title)

Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;



new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
