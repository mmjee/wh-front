<template>
  <v-progress-linear indeterminate v-if="loaded === false" />
  <v-data-table
      v-else
      :headers="headers"
      :items="data.products"
  />
</template>

<script>
import { humanizeQuantity } from '@/libwarehouse/utils'

export default {
  name: 'AdminProductsAndInventoryTable',
  data: () => ({
    loaded: false,
    data: null,
    headers: [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Tagline',
        value: 'upperTagline'
      },
      {
        text: 'SKU',
        value: 'skuNo'
      },
      {
        text: 'Price',
        value: 'price'
      },
      {
        text: 'Quantity',
        value: 'humanQuantity'
      }
    ]
  }),
  methods: {
    async loadData () {
      try {
        this.data = await this.$store.dispatch('user/makeSignedRequest', {
          method: 'GET',
          url: '/api/v1/admin-get-all-products'
        })
        this.data.products.forEach(prod => {
          prod.humanQuantity = humanizeQuantity(prod.quantity)
        })
      } catch (e) {
      } finally {
        this.loaded = true
      }
    }
  },
  watch: {
    '$store.state.user.isAuthenticated': 'loadData'
  },
  mounted () {
    this.loadData()
  }
}
</script>
