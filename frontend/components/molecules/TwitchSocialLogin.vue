<template>
  <v-btn color="purple" class="ma-2 white--text" @click.stop="login">
    <v-icon left> mdi-twitch </v-icon>
    Log in with Twitch
  </v-btn>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TwitchSocialLogin',
  methods: {
    async login() {
      try {
        const response = await axios.get(
          `${this.$config.apiURL}/accounts/twitch/login`
        )
        const state = response.data.state
        const maxAge = response.data.maxAge
        const authURL = response.data.redirect
        this.$cookies.set('oauth2_state', state, {
          path: '/',
          maxAge,
          httpOnly: false,
          sameSite: 'none',
          secure: true,
        })
        window.location.href = authURL
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
