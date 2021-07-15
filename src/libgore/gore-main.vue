<script>
import { get as _get } from 'lodash-es'
import { Slider, SliderItem } from 'vue-easy-slider'

export default {
  name: 'GORERenderer',
  props: ['cfg'],
  components: {
    Slider,
    SliderItem
  },
  data () {
    return {}
  },
  computed: {
    goreClass () {
      return _get(this.cfg, ['type'])
    },

    goreArguments () {
      return _get(this.cfg, ['arguments'])
    },

    goreChildren () {
      return _get(this.cfg, ['children'])
    },

    // p-text specific stuff
    goreStyle () {
      const styles = {}
      if (this.goreArguments.textAlign) {
        styles.textAlign = this.goreArguments.textAlign
      }

      return styles
    }
  }
}
</script>

<template>
  <!-- TODO multislider by using 3 parallel sliders by splitting the slides into row * n, row * n + 1, row * n + 2 slides -->
  <Slider v-if="goreClass === 'carousel'">
    <SliderItem v-for="item in goreChildren" :key="item.id">
      <GORERenderer :cfg="item" />
    </SliderItem>
  </Slider>
  <v-navigation-drawer v-else-if="goreClass === 'cat-nav'" permanent floating>
    <v-list
        dense
        rounded
    >
      <v-list-item
          v-for="item in goreChildren"
          :key="item.categoryName"
          link
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.categoryName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <p v-else-if="goreClass === 'p-text'" :style="goreStyle">
    {{ goreChildren }}
  </p>
</template>

<style module>
.App {
  padding: 20px;
}
</style>
