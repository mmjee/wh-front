import Vue from 'vue'
import Vuex from 'vuex'

import globalConfigStore from './modules/global-config-store'
import userStore from './modules/user-store'
import filterCfg from './modules/filter-configuration-store'

Vue.use(Vuex)

const WarehouseStore = new Vuex.Store({
  modules: {
    global: globalConfigStore,
    user: userStore,
    filterCfg
  }
})

export {
  WarehouseStore
}
