import Vue from 'vue';
import Vuex from 'vuex'
import App from './App.vue';
import router from './router';
import Axios from 'axios';

// Global components
import Title from '@/components/Title.vue'
Vue.component('title-element', Title)

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loadedGames: []
  }
})

Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
