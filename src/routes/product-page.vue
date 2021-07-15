<template>
  <v-container v-if="loaded">
    <v-row >
      <v-col md="3">
        <v-img :src="product.productPhoto" contain />
      </v-col>
      <v-col md="6" class="pt-16">
        <h4 class="text-h4 pb-6">{{ product.name }}</h4>
        <h5 class="text-h5">Price: {{ product.price }} {{ $store.state.global.globalConfig.storeCurrency }}</h5>
        <h5 class="text-h5 pb-2">Quantity Available: {{ product.availableQuantity === -1 ? '\u221E' : product.availableQuantity }}</h5>
        <v-divider />
        <v-container v-html="product.lowerDescription" />
      </v-col>
      <v-col md="3" class="pt-16">
        <v-card elevation="4">
          <v-row class="px-4">
            <v-col sm="12">
              <QuantitySelector v-model="selectedQuantity" />
            </v-col>
          </v-row>
          <v-row class="px-4">
            <v-col sm="12">
              <v-btn x-large color="primary" @click="addToCart" :loading="requestInProgress" :disabled="requestInProgress">Add to cart</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { range } from 'lodash-es'
import { WarehouseAPI } from '@/libwarehouse'
import QuantitySelector from '@/routes/product-tools/quantity-selector'

let marked = null

export default {
  name: 'ProductPage',
  components: { QuantitySelector },
  data: () => ({
    loaded: false,
    errored: false,
    errorMessage: '',
    product: null,
    requestInProgress: false,

    selectedQuantity: 1
  }),

  computed: {
    fakeItemsForQty () {
      return range(1, 11).map(no => {
        return {
          text: no.toString(),
          value: no
        }
      }).concat([{
        text: '10+',
        value: 11
      }])
    }
  },

  methods: {
    async loadData () {
      try {
        const out = await Promise.all([
          WarehouseAPI.getByPath('/api/v1/get-product-by-id', {
            params: {
              id: this.$route.params.productID
            }
          }),
          import('marked')
        ])
        marked = out[1].default
        this.loaded = true
        this.product = out[0].product
        this.product.lowerDescription = marked(this.product.lowerDescription)
      } catch (e) {
        if (e instanceof WarehouseAPI.NotFoundError) {
          this.errored = true
          this.errorMessage = '404'
        }
        throw e
      }
    },

    async addToCart () {
      if (!this.$store.state.user.isAuthenticated) {
        this.$store.commit('global/openOrCloseLoginMenu')
        return
      }
      this.requestInProgress = true

      await this.$store.dispatch('user/makeSignedRequest', {
        method: 'POST',
        url: '/api/v1/add-product-to-cart',
        data: {
          productId: this.product.id,
          quantity: this.selectedQuantity
        }
      })
      this.requestInProgress = false
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
