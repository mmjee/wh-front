import { isBoolean } from 'lodash-es'

const globalConfigStore = {
  namespaced: true,
  state: () => ({
    globalConfig: {},
    loginMenuDialogOpen: false
  }),
  mutations: {
    setGlobalConfig (state, gc) {
      state.globalConfig = gc
    },
    openOrCloseLoginMenu (state, newState) {
      state.loginMenuDialogOpen = isBoolean(newState) ? newState : !state.loginMenuDialogOpen
    }
  }
}

export default globalConfigStore
