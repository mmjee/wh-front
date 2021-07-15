<template>
  <v-card>
    <v-card-title class="headline grey lighten-2">
      <v-btn
          icon
          dark
          v-if="$vuetify.breakpoint.mobile"
          @click="$store.commit('global/openOrCloseLoginMenu')"
      >
        <v-icon>close</v-icon>
      </v-btn>
      Log In
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <p class="headline">
              Make an account to track your orders, create a wishlist and more.
            </p>
          </v-col>
          <v-col cols="12" md="5" offset-md="1">
            <v-form>
              <v-text-field
                  v-model="fullName"
                  name="fullName"
                  label="Full Name"
                  v-if="registrationStage === 2"
                  required
              />
              <v-text-field
                  v-model="email"
                  name="email"
                  label="Email"
                  :rules="[validateEmail]"
                  required
              />
              <v-text-field
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  name="password"
                  hint="Enter a strong password"
                  v-model="password"
                  @click:append="showPassword = !showPassword"
              />
            </v-form>
            <p class="text-body-1 error--text" v-if="error">{{ error }}</p>
            <p class="text-body-1 text--primary" v-if="information">{{ information }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2" offset-md="5">
            <v-btn @click="submit" color="primary" min-width="100%" :loading="requestInProgress" :disabled="requestInProgress">Login</v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn @click="onRegisterClick" :color="registrationStage === 1 ? 'primary' : 'success'" min-width="100%" :loading="requestInProgress" :disabled="requestInProgress">Register</v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn @click="forgotPassword" color="primary" min-width="100%" :loading="requestInProgress" :disabled="requestInProgress">Forgot Password</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import emailValidator from 'email-validator'
import libbetterauth from 'libbetterauth'

import { WarehouseAPI } from '@/libwarehouse'

export default {
  name: 'LoginMenuDialog',
  data () {
    return {
      fullName: '',
      email: '',
      password: '',

      information: null,

      registrationStage: 1,
      requestInProgress: false,
      error: null,
      showPassword: false
    }
  },

  methods: {
    validateEmail (email) {
      if (!emailValidator.validate(email)) {
        return 'Invalid email.'
      } else {
        return true
      }
    },

    onRegisterClick () {
      if (this.registrationStage === 1) {
        this.registrationStage++
      } else if (this.registrationStage === 2) {
        this.register().catch(e => console.error(e))
      }
    },

    async register () {
      this.error = false
      this.requestInProgress = true
      const { publicKey } = await libbetterauth.generateKeyPairFromPW(this.password, this.$store.state.user.salt)
      try {
        await WarehouseAPI.postToPath('/api/v1/register-user-account', {
          fullName: this.fullName,
          email: this.email,
          publicKey: publicKey.toString('base64')
        })
      } catch (e) {
        if (e instanceof WarehouseAPI.BadRequestError) {
          this.error = e.res.data.errorDetails[0]
          this.requestInProgress = false
          return
        }
        if (!(e instanceof WarehouseAPI.ApplicationError)) {
          this.requestInProgress = false
          throw e
        }

        if (e.errorCode === 'ACCOUNT_ALREADY_REGISTERED') {
          this.requestInProgress = false
          this.error = 'Account already registered with this email.'
          return
        } else {
          this.requestInProgress = false
          throw e
        }
      }
      await this.$store.dispatch('user/initializeFromPW', {
        userID: this.email,
        password: this.password
      })
      this.requestInProgress = false
      this.$store.commit('global/openOrCloseLoginMenu')
    },

    async submit () {
      this.error = null
      this.requestInProgress = true

      if (!this.email || !this.password) {
        this.requestInProgress = false
        return
      }
      try {
        await this.$store.dispatch('user/initializeFromPW', {
          userID: this.email,
          password: this.password
        })
        this.requestInProgress = false
        this.$store.commit('global/openOrCloseLoginMenu')
      } catch (e) {
        this.requestInProgress = false
        if (e instanceof WarehouseAPI.AuthenticationError) {
          const { errorCode } = e.res.data
          if (errorCode === 'VERIFICATION_FAILED') {
            this.error = 'The password is incorrect.'
          } else if (errorCode === 'NO_USER_ID') {
            this.error = 'No account found with the email.'
          } else {
            this.error = 'Service Error, please try again later.'
          }
        } else {
          throw e
        }
      }
    },

    async forgotPassword () {
      this.error = false
      this.requestInProgress = true

      try {
        await WarehouseAPI.postToPath('/api/v1/forgot-password', {
          userID: this.email
        })
        this.information = 'Check your email. :)'
      } catch (e) {
        if (e instanceof WarehouseAPI.BadRequestError) {
          this.error = e.res.data.errorDetails[0]
          return
        }
        if (!(e instanceof WarehouseAPI.ApplicationError)) {
          throw e
        }

        if (e.errorCode === 'USER_ID_INVALID') {
          this.error = 'No account found on this email.'
        } else if (e.errorCode === 'EMAIL_NOT_VERIFIED') {
          this.error = 'Email not verified.'
        } else if (e.errorCode === 'REQUESTED_LESS_THAN_ONE_HOUR_AGO') {
          this.error = 'Last password requested less than a hour ago.'
        } else {
          throw e
        }
      } finally {
        this.requestInProgress = false
      }
    }
  }
}
</script>
