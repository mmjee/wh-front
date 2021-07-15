<template>
  <v-row>
    <v-col cols="12" md="6">
      <p class="text-md-h4">READ</p>
      <v-text-field label="Redis Key" v-model="getInput" />
      <v-btn x-large @click="getSubmit">Submit</v-btn>
      <JsonViewer v-if="getData != null" :value="getData" copyable boxed sort />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <p class="text-md-h4">WRITE</p>
      <v-text-field label="Redis Key" v-model="writeKey" />
      <v-textarea label="Value" v-model="writeData" />
      <v-btn x-large @click="writeSubmit">Submit</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import JSON5 from 'json5'
import JsonViewer from 'vue-json-viewer'
import { WarehouseAPI } from '@/libwarehouse'

export default {
  name: 'RedisTools',
  components: {
    JsonViewer
  },
  data () {
    return {
      getInput: '',
      getData: null,
      writeKey: '',
      writeData: ''
    }
  },

  methods: {
    async getSubmit () {
      try {
        this.getData = await WarehouseAPI.getByPath('/api/v1/get-redis-key', {
          params: {
            key: this.getInput
          }
        })
      } catch (e) {
        console.error(e)
      }
    },

    async writeSubmit () {
      try {
        await WarehouseAPI.putToPath('/api/v1/write-redis-key', JSON5.parse(this.writeData), {
          params: {
            key: this.writeKey
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
