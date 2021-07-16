<template>
  <v-form>
    <v-text-field label="Product Name" v-model="name" />
    <v-select label="Product Type" v-model="productType" :items="productTypeOptions" />
    <v-text-field label="SKU ID" v-model="skuNo" />
    <v-text-field label="Product Photo URL" v-model="productPhoto" />
    <v-text-field label="Tagline" v-model="upperTagline" />
    <v-text-field label="Product Price" type="number" v-model="price" />
    <v-textarea label="Description" v-model="lowerDescription" />
    <category-selector v-model="category" />
    <v-btn color="primary" :disabled="complete" @click="submit">Submit</v-btn>
    <v-alert class="subtitle-1 mt-2" color="warning" v-if="error">{{ error }}</v-alert>
    <p v-if="complete">Product has been successfully created.</p>
  </v-form>
</template>

<script>
import CategorySelector from '@/components/input-widgets/category-selector'

export default {
  name: 'NewProduct',
  components: {
    CategorySelector
  },

  data () {
    return {
      name: '',
      skuNo: '',
      productType: '',
      productPhoto: '',
      price: 0,
      upperTagline: '',
      lowerDescription: '',
      category: null,

      complete: false,
      error: null,
      productTypeOptions: [
        {
          text: 'Automatically Delivered',
          value: 'AUTOMATICALLY_DELIVERED'
        },
        {
          text: 'Manually Delivered',
          value: 'MANUALLY_DELIVERED'
        }
      ]
    }
  },
  methods: {
    async submit () {
      try {
        await this.$store.dispatch('user/makeSignedRequest', {
          method: 'POST',
          url: '/api/v1/admin-create-new-product',
          data: {
            name: this.name,
            type: this.productType,
            productPhoto: this.productPhoto,
            price: this.price,
            skuNo: this.skuNo,
            upperTagline: this.upperTagline,
            lowerDescription: this.lowerDescription,
            category: this.category
          }
        })
        this.error = null
        this.complete = true
      } catch (e) {
        this.error = e.res.data.errorDetails[0]
      }
    }
  }
}
</script>
