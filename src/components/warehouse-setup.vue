<template>
  <v-app>
    <v-navigation-drawer app floating permanent v-if="isDrawerOpened">
      <v-list
          nav
      >
        <v-list-item-group
            active-class="deep-purple--text text--accent-4"
        >
          <v-list-item link href="#introduction">
            <v-list-item-icon>
              <v-icon>anchor</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Introduction</v-list-item-title>
          </v-list-item>

          <v-list-item link href="#basicinfo">
            <v-list-item-icon>
              <v-icon>people</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Basic information</v-list-item-title>
          </v-list-item>

          <v-list-item link href="#regionsetup">
            <v-list-item-icon>
              <v-icon>face</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Admin Account</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>check_circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Submit</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
        app
        absolute
        color="blue"
    >
      <v-app-bar-nav-icon @click.stop="isDrawerOpened = !isDrawerOpened"></v-app-bar-nav-icon>
      <v-toolbar-title>Warehouse Setup</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main v-if="formSubmitted === false">
      <v-dialog
          v-model="errored"
          width="500"
      >
        <template v-slot:activator="{ on, attrs }">
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2">
            Error
          </v-card-title>

          <v-card-text>
            {{ errorMessage }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="errored = false"
            >
              OK!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div id="introduction">
        <p class="text-body-1">Welcome to the Warehouse Setup Screen. We'll ask you to fill out a small form for the configuration of this warehouse instance.</p>
      </div>
      <v-divider />
      <h3 id="basicinfo" class="text-h3 pa-2">Basic Information</h3>
      <v-form v-model="biFormValid">
        <v-container>
          <v-row>
            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="storeName"
                  label="Store Name"
                  required
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              md="3">
              <v-select
                prepend-icon="map"
                :items="storeCountryOpts"
                label="Store Country"
                hint="What's the primary location of this store?"
                persistent-hint
                v-model="storeCountry"
              />
            </v-col>
            <v-col
                cols="3"
            >
              <v-text-field
                  prepend-icon="attach_money"
                  v-model="storeCurrency"
                  label="Abbreviated form of the store currency, e.g. USD"
                  required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="mongoURL"
                  label="MongoDB Connection URL"
                  required
              ></v-text-field>
            </v-col>

            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="redisURL"
                  label="Redis Connection URL"
                  required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="smtpURL"
                  label="SMTP Connection URL"
                  required
              ></v-text-field>
            </v-col>

            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="smtpFrom"
                  label="From Address for emails"
                  required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="rzpId"
                  label="Razorpay Key ID"
                  required
              ></v-text-field>
            </v-col>

            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="rzpKey"
                  label="Razorpay Key Secret"
                  required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <h5 class="text-h5" id="adminaccount">
        Admin Account Details
      </h5>
      <v-form v-model="aaFormValid">
        <v-container>
          <v-row>
            <v-col
                cols="12"
                md="6"
            >
              <v-text-field
                  v-model="email"
                  label="Email"
                  required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                  v-model="password"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-btn
              elevation="2"
              outlined
              raised
              x-large
              @click="submit"
          >
            Submit
          </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-main>
    <v-main v-else>
      <p>Okay! Server has realized the configuration update and will reflect that on the next update.</p>
    </v-main>

    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
import WorldCountries from 'world-countries'
import { WarehouseAPI } from '../libwarehouse'
import { generateKeyPairFromPW } from 'libbetterauth'

function sortByTxt (a, b) {
  return a.text.localeCompare(b.text)
}

export default {
  name: 'WarehouseSetup',
  data () {
    return {
      formSubmitted: false,
      isDrawerOpened: true,
      aaFormValid: true,
      biFormValid: true,
      errored: false,
      errorMessage: '',

      storeName: '',
      // 3 letter ISO code
      storeCountry: '',
      storeCurrency: '',
      email: '',
      showPassword: false,
      password: '',

      storeCountryOpts: WorldCountries.filter(wc => {
        return wc.independent === true
      }).map(wc => {
        return {
          text: wc.name.common,
          value: wc.cca3
        }
      }).sort(sortByTxt),

      redisURL: this.$store.state.global.globalConfig.redisURL,
      mongoURL: this.$store.state.global.globalConfig.mongoURL,
      smtpURL: this.$store.state.global.globalConfig.smtpURL,
      smtpFrom: this.$store.state.global.globalConfig.smtpFrom,
      rzpId: this.$store.state.global.globalConfig.rzpId,
      rzpKey: this.$store.state.global.globalConfig.rzpKey
    }
  },

  methods: {
    async submit () {
      try {
        await WarehouseAPI.putToPath('/api/v1/set-global-config', {
          connectionInfo: {
            services: {
              redis: this.redisURL,
              mongodb: this.mongoURL,

              emailURL: this.smtpURL,
              emailAddress: this.smtpFrom,

              rzpId: this.rzpId,
              rzpKey: this.rzpKey
            }
          },
          globalConfig: {
            storeName: this.storeName,
            storeCountry: this.storeCountry,
            storeCurrency: this.storeCurrency
          },
          adminEmail: this.email
        })
      } catch (e) {
        this.errored = true
        if (e instanceof WarehouseAPI.BadRequestError) {
          this.errorMessage = 'Invalid data in connection information or store name/store country.'
        } else {
          this.errorMessage = e.message
        }
        return
      }

      try {
        const derivedKey = await generateKeyPairFromPW(this.password, this.$store.state.user.salt)
        await WarehouseAPI.putToPath('/api/v1/create-admin-user', {
          email: this.email,
          publicKey: derivedKey.publicKey.toString('base64')
        })
      } catch (e) {
        this.errored = true
        if (e instanceof WarehouseAPI.BadRequestError) {
          this.errorMessage = 'Invalid data in email or public key.'
        } else if (e instanceof WarehouseAPI.ServiceUnavailableError) {
          this.errorMessage = 'Server error, Redis and MongoDB configuration MAY POSSIBLY have caused an issue.'
        } else {
          this.errorMessage = e.message
        }
        return
      }
      this.formSubmitted = true
    }
  }
}
</script>
