import { cloneDeep } from 'lodash-es'
import libbetterauth from 'libbetterauth'

import { WarehouseAPI } from '@/libwarehouse'

const dummySerializer = (x) => x

const userStore = {
  namespaced: true,
  state: () => ({
    salt: Buffer.from(process.env.VUE_APP_SALT || 'b95b4072600205c5', 'hex'),

    user: null,
    userID: null,
    publicKey: null,
    secretKey: null,
    isAuthenticated: false
  }),
  mutations: {
    setKeys (state, { isAuthenticated, userID, user, publicKey, secretKey }) {
      state.isAuthenticated = isAuthenticated
      state.userID = userID
      state.user = user
      state.publicKey = publicKey
      state.secretKey = secretKey
    },

    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    deinitializeAuth ({ state, commit }) {
      commit('setKeys', {
        isAuthenticated: false,
        userID: null,
        user: null,
        publicKey: null,
        secretKey: null
      })
    },

    async initializeAuth ({ state, commit }) {
      const isAuthenticated = window.localStorage.getItem('IS_AUTHENTICATED')
      if (isAuthenticated !== 'true') {
        return
      }

      const userID = window.localStorage.getItem('USER_ID')
      const publicKey = Buffer.from(window.localStorage.getItem('PUBLIC_KEY'), 'hex')
      const secretKey = Buffer.from(window.localStorage.getItem('SECRET_KEY'), 'hex')

      try {
        const data = await WarehouseAPI.getByPath('/api/v1/whoami', {
          params: await libbetterauth.signObject({ userID }, secretKey)
        })

        commit('setKeys', {
          isAuthenticated: true,
          userID,
          user: data.user,
          publicKey,
          secretKey
        })
      } catch (e) {
        window.localStorage.removeItem('USER_ID')
        window.localStorage.removeItem('PUBLIC_KEY')
        window.localStorage.removeItem('SECRET_KEY')
      }
    },

    async refreshFromWhoami ({ state, commit }) {
      const data = await WarehouseAPI.getByPath('/api/v1/whoami', {
        params: await libbetterauth.signObject({ userID: state.userID }, state.secretKey)
      })

      commit('setUser', data.user)
    },

    async initializeFromPW ({ state, commit }, { userID, password }) {
      const { publicKey, secretKey } = await libbetterauth.generateKeyPairFromPW(password, state.salt)

      console.log('Public Key:', publicKey.toString('base64'))
      // DO NOT HANDLE THE ERROR, IT SHOULD BE BUBBLED AND HANDLED BY THE COMPONENT THAT CALLS THIS
      const data = await WarehouseAPI.getByPath('/api/v1/whoami', {
        params: await libbetterauth.signObject({ userID }, secretKey)
      })
      commit('setKeys', {
        isAuthenticated: true,
        userID,
        user: data.user,
        publicKey,
        secretKey
      })
      window.localStorage.setItem('IS_AUTHENTICATED', 'true')
      window.localStorage.setItem('USER_ID', userID)
      window.localStorage.setItem('PUBLIC_KEY', publicKey.toString('hex'))
      window.localStorage.setItem('SECRET_KEY', secretKey.toString('hex'))
    },

    async makeSignedRequest ({ state }, body) {
      const sBody = body

      if (state.isAuthenticated) {
        if (sBody.params) {
          sBody.params = cloneDeep(sBody.params)
          sBody.params.userID = state.userID
          sBody.params = JSON.stringify(await libbetterauth.signObject(sBody.params, state.secretKey))
          sBody.paramsSerializer = dummySerializer
        } else if (sBody.data) {
          sBody.data = cloneDeep(sBody.data)
          sBody.data.userID = state.userID
          sBody.data = await libbetterauth.signObject(sBody.data, state.secretKey)
        } else {
          sBody.params = await libbetterauth.signObject({
            userID: state.userID
          }, state.secretKey)
        }
      }

      return WarehouseAPI.do(sBody)
    }
  }
}

export default userStore
