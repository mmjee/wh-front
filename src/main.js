import Vue from 'vue'

import App from './App.vue'
import { WarehouseStore } from './store'
import vuetify from './plugins/vuetify'
import router from './plugins/router'

import '@/styles/main.scss'

export default new Vue({
  el: '#app',
  render: (h) => h(App),
  vuetify,
  router,
  store: WarehouseStore
})
