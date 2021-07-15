<template>
  <v-progress-linear indeterminate height="1vh" v-if="!ready" />
  <v-container fluid v-else>
    <v-row>
      <v-col md="4" offset="4">
        <v-btn min-width="100%" x-large @click="redirectToCart">Payment failed? Go back to cart.</v-btn>
      </v-col>
    </v-row>
    <v-snackbar
        v-model="showNoAddressSnackbar"
    >
      No Address was selected, redirecting to homepage.

      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showNoAddressSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="showNoProductsSnackbar"
    >
      No products found in the cart, redirecting to homepage.

      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showNoProductsSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="showOrderAlreadyPaidSB"
    >
      Order has already been paid for, payment will be refunded in due time. If you don't receive your refund in 5 days, contact the support.
      Redirecting to homepage.

      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showOrderAlreadyPaidSB = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="showPaymentFailedSB"
    >
      Payment failed, redirecting you to the cart.

      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showPaymentFailedSB = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="showProductUnsatisfiableSnackbar"
    >
      Not enough quantity to satisfy order, redirecting to cart.

      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showProductUnsatisfiableSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { loadScript } from 'load-script-async'
import delay from 'delay'

import { WarehouseAPI } from '@/libwarehouse'

export default {
  name: 'CartPayments',
  data: () => ({
    hasError: false,
    errorCode: null,
    ready: false,

    showNoAddressSnackbar: false,
    showNoProductsSnackbar: false,
    showOrderAlreadyPaidSB: false,
    showProductUnsatisfiableSnackbar: false,
    showPaymentFailedSB: false
  }),

  methods: {
    async redirectToHomepage () {
      await delay(5000)
      await this.$router.replace('/')
    },

    async redirectToCart () {
      await delay(5000)
      await this.$router.replace('/cart')
    }
  },

  async mounted () {
    if (!window.Razorpay) {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    }
    try {
      const response = await this.$store.dispatch('user/makeSignedRequest', {
        method: 'POST',
        url: '/api/v1/create-order'
      })
      const rzpObj = new window.Razorpay({
        key: this.$store.state.global.globalConfig.razorpayKeyId,
        amount: response.totalPrice,
        currency: this.$store.state.global.globalConfig.storeCurrency,
        name: this.$store.state.global.globalConfig.storeName,
        description: 'Payment for order',
        order_id: response.paymentOrderID,
        handler: async (secondStageRZP) => {
          try {
            await this.$store.dispatch('user/makeSignedRequest', {
              method: 'POST',
              url: '/api/v1/handle-payment',
              data: {
                orderID: response.whOrderID,
                paymentID: secondStageRZP.razorpay_payment_id
              }
            })
            await this.$router.replace('/order/' + response.whOrderID)
          } catch (e) {
            if (e instanceof WarehouseAPI.ApplicationError) {
              switch (e.errorCode) {
                case 'ORDER_ALREADY_PAID':
                  this.ready = true
                  this.showOrderAlreadyPaidSB = true
                  await this.redirectToHomepage()
                  break
                default:
                  throw new Error('HOW THE FUCK DID THIS HAPPEN')
              }
            } else {
              throw e
            }
          }
        },
        theme: {
          color: '#3399cc'
        }
      })
      rzpObj.on('payment.failed', () => {
        this.showPaymentFailedSB = true
        this.redirectToCart()
      })
      rzpObj.open()
    } catch (e) {
      if (e instanceof WarehouseAPI.ApplicationError) {
        this.errorCode = e.errorCode
        switch (e.errorCode) {
          case 'NO_ADDRESS_SELECTED':
            this.ready = true
            this.showNoAddressSnackbar = true
            await this.redirectToHomepage()
            break
          case 'NO_PRODUCTS_IN_CART':
            this.ready = true
            this.showNoProductsSnackbar = true
            await this.redirectToHomepage()
            break
          case 'PRODUCT_UNSATISFIABLE':
            this.ready = true
            this.showProductUnsatisfiableSnackbar = true
            await this.redirectToCart()
            break
          default:
            debugger
            throw new Error('HOW THE FUCK DID THIS HAPPEN')
        }
      } else {
        throw e
      }
    } finally {
      this.ready = true
    }
  }
}
</script>
