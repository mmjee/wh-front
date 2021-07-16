<template>
  <v-progress-linear height="1vh" indeterminate v-if="loaded === false" />
  <v-form v-else-if="loaded === true">
    <v-select label="Product to add codes to" v-model="selectedProduct" :items="productOptions" />
    <v-textarea label="Codes, one per line" v-model="codes" />
    <v-btn color="primary" @click="submit" x-large :loading="requestInProgress" :disabled="requestInProgress">Submit</v-btn>
    <v-alert class="subtitle-1 mt-2" color="warning" v-if="error">{{ error }}</v-alert>
  </v-form>
</template>

<script>
export default {
  name: 'AddCodesToProduct',
  data: () => ({
    loaded: false,
    requestInProgress: false,
    error: null,
    productOptions: null,
    selectedProduct: null,
    codes: ''
  }),
  methods: {
    async getData () {
      const { products } = await this.$store.dispatch('user/makeSignedRequest', {
        method: 'GET',
        url: '/api/v1/admin-get-all-products'
      })
      this.productOptions = products.map(p => {
        return {
          text: p.name,
          value: p._id
        }
      })
      this.loaded = true
    },

    async submit () {
      this.requestInProgress = true
      try {
        await this.$store.dispatch('user/makeSignedRequest', {
          method: 'PUT',
          url: '/api/v1/admin-add-codes-to-product',
          data: {
            selectedProduct: this.selectedProduct,
            codes: this.codes
          }
        })
      } catch (e) {
        this.error = e.res.data.errorDetails[0]
      } finally {
        this.requestInProgress = false
      }
    }
  },

  mounted () {
    this.getData().catch(e => console.error(e))
  }
}
</script>
