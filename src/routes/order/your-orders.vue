<template>
  <v-progress-linear indeterminate height="1vh" v-if="!loaded" />
  <v-container fluid class="align-center" v-else>
    <v-row dense v-for="order in orders" :key="order._id" class="my-4">
      <v-col offset-md="2" md="8">
        <v-card elevation="4" link :to="'/order/' + order._id">
          <v-card-title>Order from {{ order.humanCreatedAt }}</v-card-title>
          <v-card-subtitle>Status: {{ order.humanOrderStatus }}</v-card-subtitle>
          <v-card-text>
            Containing {{ order.humanCartItems }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { humanizeStatusId, summarizeCartItems } from '@/libwarehouse/utils'
import { format } from 'fecha'

export default {
  name: 'ViewOrders',
  data: () => ({
    loaded: false,
    orders: null
  }),
  computed: {
    isAuthenticated () {
      return this.$store.state.user.isAuthenticated
    },
    storeCurrency () {
      return this.$store.state.global.globalConfig.storeCurrency
    }
  },
  watch: {
    isAuthenticated () {
      this.getData().catch(e => console.error(e))
    }
  },
  mounted () {
    this.getData()
  },

  methods: {
    async getData () {
      const odata = await this.$store.dispatch('user/makeSignedRequest', {
        method: 'GET',
        url: '/api/v1/get-all-orders'
      })
      if (!odata) {
        return
      }
      this.loaded = true
      this.orders = odata.orders.map(o => {
        o.humanCreatedAt = format(new Date(o.createdAt), 'mediumDate')
        o.humanOrderStatus = humanizeStatusId(o.status)
        o.humanCartItems = summarizeCartItems(o.items)
        return o
      })
    }
  }
}
</script>
