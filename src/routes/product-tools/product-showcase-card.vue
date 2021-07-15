<template>
  <v-card
      rounded="xl"
      elevation="4"
      link
      :to="'/product/by-id/' + product.id"
      :disabled="isProductDisabled"
  >
    <v-img
        contain
        :src="product.productPhoto"
    />

    <v-card-title>{{ product.name }}</v-card-title>

    <v-card-text>
      <!-- <v-row
          align="center"
          class="mx-0"
      >
        <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
        ></v-rating>

        <div class="grey--text ml-4">
          4.5 (413)
        </div>
      </v-row> -->

      <div class="my-4 body-1">
        {{ product.upperTagline }}<br />
        Available Quantity: {{ product.availableQuantity === -1 ? '\u221E' : product.availableQuantity }}
      </div>
      <h5 class="text-h5">{{ product.price }} {{ $store.state.global.globalConfig.storeCurrency }}</h5>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ProductShowcaseCard',
  props: ['product'],
  computed: {
    isProductDisabled () {
      return this.product.availableQuantity === 0
    }
  }
}
</script>
