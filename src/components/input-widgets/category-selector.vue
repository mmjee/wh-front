<template>
  <v-select
      label="Category"
      :loading="loading"
      item-text="categoryName"
      item-value="id"
      :items="data"
      v-on:input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'CategorySelector',

  data () {
    return {
      loading: true,
      data: []
    }
  },

  mounted () {
    this.loadData().catch(e => console.error(e))
  },

  methods: {
    async loadData () {
      const resp = await this.$store.dispatch('user/makeSignedRequest', {
        method: 'GET',
        url: '/api/v1/list-category'
      })

      this.loading = false
      this.data = resp.categories
    }
  }
}
</script>
