<template>
  <v-progress-linear indeterminate height="1vh" v-if="!loaded" />
  <v-container v-else>
    <v-row>
      <v-col md="8" :order="$vuetify.breakpoint.mobile ? 2 : 1">
        <v-card v-for="(cp, cpIdx) in order.items" :key="cp.id" :class="{ 'my-8': cpIdx !== 0 }" elevation="6">
          <v-img :src="cp.product.productPhoto" max-height="10vh" contain />
          <v-card-title class="text-h5">{{ cp.product.name }}</v-card-title>
          <v-row class="pl-8">
            <v-col md="6">
              <h5 class="text-h5">{{ cp.price }} {{ storeCurrency }} × {{ cp.quantity }} = {{ cp.price * cp.quantity }} {{ storeCurrency }}</h5>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col md="4" :order="$vuetify.breakpoint.mobile ? 1 : 2">
        <v-card elevation="6" class="pa-2">
          <!-- it's in cents or paisa, etc -->
          <v-card-title class="text-h5">{{ orderStatusHuman }}</v-card-title>
          <v-card-subtitle class="text-h6">Total: {{ order.total / 100 }} {{ storeCurrency }}</v-card-subtitle>
          <v-card-text>
            <p>Order ID: {{ order._id }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { humanizeStatusId } from '@/libwarehouse/utils'

export default {
  name: 'ViewOrder',
  data: () => ({
    loaded: false,
    order: null
  }),
  computed: {
    isAuthenticated () {
      return this.$store.state.user.isAuthenticated
    },
    storeCurrency () {
      return this.$store.state.global.globalConfig.storeCurrency
    },
    orderStatusHuman () {
      return humanizeStatusId(this.order.status)
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
        url: '/api/v1/get-order-by-id',
        params: {
          id: this.$route.params.id
        }
      })
      if (!odata) {
        return
      }
      this.loaded = true
      this.order = odata.order
    }
  }
}
</script>
