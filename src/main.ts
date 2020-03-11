import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Colors & mixins
require('@/assets/css/main.scss');

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
