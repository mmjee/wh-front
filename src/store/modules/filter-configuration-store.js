export default {
  namespaced: true,
  state: () => ({
    filterOptions: {
      category: [],
      priceRange: [100, 1000]
    },
    filterData: {
      hasUserInput: false,
      category: '',
      priceRange: [100, 1000]
    }
  }),
  mutations: {
    initializeOption (store, { key, value }) {
      store.filterOptions[key] = value
    },

    updateToDefaults (store, [key, value]) {
      store.filterData[key] = value
    },

    updateSelection (store, [key, value]) {
      store.filterData.hasUserInput = true
      store.filterData[key] = value
    },

    setPriceRange (store, [key, value]) {
      store.filterData.hasUserInput = true
      store.filterData.priceRange[key] = value
    }
  }
}
