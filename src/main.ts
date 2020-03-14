import Vue from 'vue';
import Vuex from 'vuex'
import App from './App.vue';
import router from './router';
import axios, {AxiosStatic} from 'axios';

// Global components
import Title from '@/components/Title.vue';
import Tag from '@/components/Tag.vue';
Vue.component('title-element', Title);
Vue.component('tag', Tag);

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loadedGames: []
  }
})

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

declare module 'vue/types/vue' {
  interface Vue {
      $axios: AxiosStatic;
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
