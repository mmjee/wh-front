<template>
  <v-form>
    <v-text-field label="Category Name" v-model="categoryName" />
    <category-selector v-model="category" />
    <v-btn color="primary" :disabled="complete" @click="submit">Submit</v-btn>
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

      complete: false
    }
  },
  methods: {
    async submit () {
      await this.$store.dispatch('user/makeSignedRequest', {
        method: 'POST',
        url: '/api/v1/admin-create-new-category',
        data: {
          categoryName: this.categoryName,
          parentCategory: this.category
        }
      })
      this.complete = true
    }
  }
}
</script>
