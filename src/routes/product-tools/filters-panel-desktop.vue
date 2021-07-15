<template>
  <v-col md="2">
    <v-select
        :loading="$store.state.filterCfg.filterOptions.category === null"
        :items="$store.state.filterCfg.filterOptions.category"
        :value="$store.state.filterCfg.filterData.category"
        v-on:change="$store.commit('filterCfg/updateSelection', ['category', $event])"
        item-text="categoryName"
        item-value="id"
        label="Categories"
        outlined
    ></v-select>
    <v-divider />
    <p class="text-h6">Price</p>
    <v-range-slider
        :value="$store.state.filterCfg.filterData.priceRange"
        @change="$store.commit('filterCfg/updateSelection', ['priceRange', $event])"
        :min="$store.state.filterCfg.filterOptions.priceRange[0]"
        :max="$store.state.filterCfg.filterOptions.priceRange[1]"
        step="10"
        hide-details
        class="align-center"
    >
      <template v-slot:prepend>
        <v-text-field
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            :value="$store.state.filterCfg.filterData.priceRange[0]"
            @change="$store.commit('filterCfg/setPriceRange', [0, $event])"
        ></v-text-field>
      </template>
      <template v-slot:append>
        <v-text-field
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
            :value="$store.state.filterCfg.filterData.priceRange[1]"
            @change="$store.commit('filterCfg/setPriceRange', [1, $event])"
        ></v-text-field>
      </template>
    </v-range-slider>
    <v-divider />
  </v-col>
</template>

<script>
import { WarehouseAPI } from '@/libwarehouse'

export default {
  name: 'FiltersPanelDesktop',

  data: () => ({
    selectedCategory: null,
    categoryList: null
  }),

  methods: {
    async loadCategories () {
      this.$store.commit('filterCfg/initializeOption', {
        key: 'category',
        value: (await WarehouseAPI.getByPath('/api/v1/list-category')).categories
      })
    },

    loadData () {
      return Promise.all([
        this.loadCategories()
      ])
    }
  },

  mounted () {
    this.loadData()
  }
}
</script>
