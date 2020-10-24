import Vue from 'vue'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from './store'
import VueResource from 'vue-resource'
import Header from '@/components/Header.vue'

Vue.config.productionTip = false

Vue.use(VueResource)

Vue.component('main-header', Header)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
