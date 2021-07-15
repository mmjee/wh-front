
<template>
  <WarehouseSetup v-if="$store.state.global.globalConfig.needsInitialConfig === true" />
  <v-app v-else>
    <v-app-bar
        app
        absolute
        color="blue"
    >
      <!-- TODO soon to be used for stuff like orders, wishlist, etc -->
      <v-app-bar-nav-icon @click="navOpen = !navOpen" v-model="navOpen"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $store.state.global.globalConfig.storeName }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y v-if="$store.state.global.globalConfig.debugEnabled">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>favorite</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link to="/debug/redis-tools">
            Redis Tools
          </v-list-item>
        </v-list>
      </v-menu>

      <v-dialog
          :value="$store.state.global.loginMenuDialogOpen"
          @input="$store.commit('global/openOrCloseLoginMenu', $event)"
          max-width="60vw"
          v-if="!$store.state.user.isAuthenticated"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>

        <LoginMenuDialog />
      </v-dialog>

      <v-btn icon link to="/cart" v-if="$store.state.user.isAuthenticated">
        <v-icon>shopping_cart</v-icon>
      </v-btn>
      <v-btn icon link to="/admin/product/create" v-if="$store.state.user.isAuthenticated && $store.state.user.user.privilegeLevel > 3">
        <v-icon>settings</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
        app
        v-model="navOpen"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title" style="font-weight: normal">
            {{ $store.state.global.globalConfig.storeName }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />

      <v-list-item link @click="onClickLoginLink" v-if="!isLoggedIn">
        <v-list-item-icon>
          <v-icon>manage_accounts</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title" style="font-weight: normal">
            Login
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/">
        <v-list-item-icon>
          <v-icon>format_list_bulleted</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title" style="font-weight: normal">
            Products
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item link to="/my/orders">
        <v-list-item-icon>
          <v-icon>inventory</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title" style="font-weight: normal">
            My Orders
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<style module>
@import url(https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900);
@import url(https://fonts.googleapis.com/icon?family=Material+Icons);
</style>

<script>
import { WarehouseAPI } from './libwarehouse'

import GOREAPILoader from './libgore/gore-api-loader'
import LoginMenuDialog from './components/user/login-menu-dialog'

export default {
  name: 'App',
  components: {
    GOREAPILoader,
    WarehouseSetup: () => import('@/components/warehouse-setup'),
    LoginMenuDialog
  },
  data () {
    return {
      navOpen: false
    }
  },

  methods: {
    onClickLoginLink () {
      this.$store.commit('global/openOrCloseLoginMenu')
    }
  },

  computed: {
    isLoggedIn () {
      return this.$store.state.user.isAuthenticated
    }
  },

  async mounted () {
    const globalConfig = await WarehouseAPI.getByPath('/api/v1/get-global-config')
    this.$store.commit('global/setGlobalConfig', globalConfig)
    await this.$store.dispatch('user/initializeAuth')
  }
}
</script>
