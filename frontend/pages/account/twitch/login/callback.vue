<template>
  <div>attempting to login...</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TwitchLoginCallbackPage',
  head() {
    return {
      title: 'Login',
    }
  },
  async mounted() {
    const params = this.$route.query
    try {
      const response = await axios.get(
        `${this.$config.apiURL}/accounts/twitch/login/callback`,
        {
          params,
          withCredentials: true,
        }
      )
      const jwt = response.data.token
      const expires = response.data.expires
      this.$cookies.set('jwt', jwt, {
        path: '/',
        expires: new Date(expires),
        httpOnly: false,
        secure: true,
      })
      this.$store.commit('auth/setSession', this.$cookies.get('jwt'))
      this.$router.push('/account')
    } catch (error) {
      console.log(error)
    }
  },
}
</script>
