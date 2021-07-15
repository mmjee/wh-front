<template>
  <v-container>
    <v-row v-if="productList != null">
      <FiltersPanelDesktop />
      <v-divider vertical />
      <v-col md="10">
        <v-row v-for="(row, rowId) in productRows" :key="rowId">
          <v-col v-for="product in row" :key="product.id" md="4">
            <ProductShowcaseCard :product="product" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { chunk } from 'lodash-es'

import FiltersPanelDesktop from '@/routes/product-tools/filters-panel-desktop'
import ProductShowcaseCard from '@/routes/product-tools/product-showcase-card'

export default {
  name: 'ProductExplorerRte',
  components: {
    ProductShowcaseCard,
    FiltersPanelDesktop
  },
  data: () => ({
    productList: null,
    filterData: null
  }),

  mounted () {
    this.loadData(true)
  },

  computed: {
    productRows () {
      if (!this.productList) {
        return []
      }
      return chunk(this.productList, 4)
    }
  },

  watch: {
    '$store.state.filterCfg.filterData': {
      deep: true,
      handler () {
        this.loadData().catch(e => console.error(e))
      }
    }
  },

  methods: {
    async loadData (firstInit = false) {
      const resp = await this.$store.dispatch('user/makeSignedRequest', {
        method: 'GET',
        url: '/api/v1/get-top-20-products',
        params: this.$store.state.filterCfg.filterData.hasUserInput ? this.$store.state.filterCfg.filterData : undefined
      })
      if (firstInit) {
        const PL = resp.list
        const priceRange = [Math.min(...(PL.map(p => p.price))) - 10, Math.max(...(PL.map(p => p.price))) + 10]

        this.$store.commit('filterCfg/initializeOption', { key: 'priceRange', value: priceRange })
        this.$store.commit('filterCfg/updateToDefaults', ['priceRange', priceRange])
      }
      this.productList = resp.list
    },

    onFilterUpdate (fd) {
      this.filterData = fd
    }
  }
}
</script>
