<template>
  <v-form>
    <v-text-field label="Category Name" v-model="categoryName" />
    <category-selector v-model="category" />
    <v-btn color="primary" :loading="requestInProgress" :disabled="requestInProgress" @click="submit">Submit</v-btn>
    <v-alert class="subtitle-1 mt-2" color="warning" v-if="error">{{ error }}</v-alert>
    <p v-if="complete">Category has been successfully created.</p>
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
      categoryName: '',
      category: null,

      requestInProgress: false,
      complete: false,
      error: null
    }
  },
  methods: {
    async submit () {
      try {
        await this.$store.dispatch('user/makeSignedRequest', {
          method: 'POST',
          url: '/api/v1/admin-create-new-category',
          data: {
            categoryName: this.categoryName,
            parentCategory: this.category
          }
        })
        this.error = null
        this.complete = true
      } catch (e) {
        this.error = e.res.data.errorDetails[0]
      } finally {
        this.requestInProgress = false
      }
    }
  }
}
</script>
