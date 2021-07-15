<template>
  <v-select :items="fakeItemsForQty" :value="value" @input="onInput" label="Quantity" v-if="!switchedToTextMode" />
  <v-text-field type="number" :value="value" label="Quantity" @input="onInput" v-else />
</template>

<script>
import { range } from 'lodash-es'

export default {
  name: 'QuantitySelector',
  props: ['value'],
  data: () => ({
    switchedToTextMode: false
  }),

  methods: {
    onInput (ev) {
      this.$emit('input', Number(ev))
    }
  },

  watch: {
    value: {
      handler (nextValue) {
        if (nextValue > 10) {
          this.switchedToTextMode = true
        }
      },
      immediate: true
    }
  },

  computed: {
    fakeItemsForQty () {
      return range(1, 11).map(no => {
        return {
          text: no.toString(),
          value: no
        }
      }).concat([{
        text: '10+',
        value: 11
      }])
    }
  }
}
</script>
