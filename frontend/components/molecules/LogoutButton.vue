<template>
  <v-btn color="primary" class="ma-2 white--text" @click.stop="logout">
    <v-icon left> mdi-logout </v-icon>
    Logout
  </v-btn>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LogoutButton',
  methods: {
    async logout() {
      try {
        await axios.get(`${this.$config.apiURL}/accounts/logout`, {
          headers: {
            Authorization: `Bearer ${this.$cookies.get('jwt')}`,
          },
        })
        this.$cookies.set('jwt', '', {
          maxAge: -1,
          path: '/',
          httpOnly: false,
          secure: false,
        })
        this.$store.commit('auth/setSession', this.$cookies.get('jwt'))
        this.$store.commit('user/init')
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
