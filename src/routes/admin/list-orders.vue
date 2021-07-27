<template>
  <v-progress-linear indeterminate v-if="loaded === false" />
  <v-data-table
    v-else
    :headers="headers"
    :items="data.orders"
  />
</template>

<script>
import { summarizeCartItems } from '@/libwarehouse/utils'

export default {
  name: 'ListOrders',
  data: () => ({
    loaded: false,
    data: null,
    headers: [
      {
        text: 'Email',
        value: 'orderCreator.email'
      },
      {
        text: 'Status',
        value: 'status'
      },
      {
        text: 'Amount in 1/100 of your Currency',
        value: 'total'
      },
      {
        text: 'Items',
        value: 'humanCartItems'
      }
    ]
  }),
  methods: {
    async loadData () {
      try {
        this.data = await this.$store.dispatch('user/makeSignedRequest', {
          method: 'GET',
          url: '/api/v1/admin-get-all-orders'
        })
        this.data.orders.forEach((od) => {
          od.humanCartItems = summarizeCartItems(od.items)
        })
      } catch (e) {
      } finally {
        this.loaded = true
      }
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
