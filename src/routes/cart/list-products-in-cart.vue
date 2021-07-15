<template>
  <v-progress-linear indeterminate height="1vh" v-if="!loaded" />
  <v-container v-else>
    <v-row>
      <v-col md="8">
        <v-card v-for="(cp, cpIdx) in cartProducts" :key="cp.id" :class="{ 'my-8': cpIdx !== 0 }" elevation="6">
          <v-card-title class="text-h5">{{ cp.product.name }}</v-card-title>
          <v-row class="pl-8">
            <v-col md="2">
              <h5 class="text-h5">{{ cp.product.price }} {{ $store.state.global.globalConfig.storeCurrency }}</h5>
            </v-col>
            <v-col md="1" v-if="$vuetify.breakpoint.mdAndUp" class="text-center">
              <v-divider vertical />
            </v-col>
            <v-col md="2">
              <QuantitySelector v-model="cp.quantity" />
              <v-btn v-if="cp.syncedQuantity !== cp.quantity" @click="updateQuantity(cp)" color="primary" min-width="100%">Update</v-btn>
            </v-col>
            <v-col md="1" v-if="$vuetify.breakpoint.mdAndUp" class="text-center">
              <v-divider vertical />
            </v-col>
            <v-col md="2">
              <v-btn color="warning" min-width="100%" large @click="deleteCP(cp)">Delete</v-btn>
            </v-col>
            <!-- <v-col md="1" v-if="$vuetify.breakpoint.mdAndUp" class="text-center">
              <v-divider vertical />
            </v-col> -->
          </v-row>
        </v-card>
      </v-col>
      <v-col md="4">
        <v-card elevation="6" class="pa-2">
          <v-card-title>Subtotal: {{ totalPrice }} {{ $store.state.global.globalConfig.storeCurrency }}</v-card-title>
          <v-card-actions class="pl-md-8">
            <v-btn large color="primary" link to="/cart/payments">
              Proceed to Buy
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { WarehouseAPI } from '@/libwarehouse'
import QuantitySelector from '@/routes/product-tools/quantity-selector'

export default {
  name: 'ListProductsInCart',
  components: { QuantitySelector },
  data: () => ({
    cartProducts: null,
    totalPrice: null,

    loaded: false
  }),
  methods: {
    async getData () {
      try {
        const res = await this.$store.dispatch('user/makeSignedRequest', {
          method: 'GET',
          url: '/api/v1/get-cart-products'
        })

        if (res == null) {
          return
        }

        this.loaded = true
        this.cartProducts = res.products
        this.totalPrice = res.totalPrice
      } catch (e) {
        if (!(e instanceof WarehouseAPI.AuthenticationError)) {
          throw e
        }
      }
    },

    async updateQuantity (cp) {
      await this.$store.dispatch('user/makeSignedRequest', {
        method: 'PUT',
        url: '/api/v1/update-cartproduct-quantity',
        data: {
          CPID: cp.id,
          quantity: cp.quantity
        }
      })
      cp.syncedQuantity = cp.quantity
      await this.getData()
    },

    async deleteCP (cp) {
      await this.$store.dispatch('user/makeSignedRequest', {
        method: 'DELETE',
        url: '/api/v1/delete-cart-product',
        data: {
          CPID: cp.id
        }
      })
      await this.getData()
    }
  },
  mounted () {
    this.getData().catch(e => console.error(e))
  },
  computed: {
    isAuthenticated () {
      return this.$store.state.user.isAuthenticated
    }
  },
  watch: {
    isAuthenticated () {
      this.getData().catch(e => console.error(e))
    }
  }
}
</script>
