<template>
  <loading active
           :can-cancel="false"
           :is-full-page="true"
           v-if="!loaded"
  />
  <WHErrorPage :error="this.errored" v-else-if="this.errored !== false" />
  <GORERenderer :cfg="data" v-else />
</template>

<script>
import GORERenderer from './gore-main'
import WHErrorPage from '../components/error-page'
import { WarehouseAPI } from '../libwarehouse'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'GOREAPILoader',
  // TODO path, type (GET, POST, PUT, DELETE), data, etc
  props: ['path'],
  components: {
    GORERenderer,
    Loading,
    WHErrorPage
  },
  data () {
    return {
      loaded: false,
      errored: false,
      data: null
    }
  },
  async beforeMount () {
    try {
      // TODO parse type
      this.data = await WarehouseAPI.getByPath(this.path)
    } catch (e) {
      if (e instanceof WarehouseAPI.APIError) {
        this.errored = e.status
      } else {
        this.errored = e
      }
    } finally {
      this.loaded = true
    }
  }
}
</script>
