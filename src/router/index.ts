import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    include: true,
    component: Home
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    include: true,
    component: Detail
  },
  {
    path: '/random/:id',
    name: 'Random',
    include: false,
    component: Detail
  },
  {
    path: '/random',
    name: 'Random',
    include: true,
    component: Detail
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Setting the page title
router.beforeEach((to, from, next) => {
  document.title = 'Game finder - ' + to.name;
  next();
})

export default router
