<template>
  <v-btn color="purple" class="ma-2 white--text" @click.stop="login">
    <v-icon left> mdi-twitch </v-icon>
    Log in with Twitch
  </v-btn>
</template>

<script>
export default {
  name: 'TwitchSocialLogin',
  methods: {
    login() {
      window.location.href = `${this.$config.apiURL}/accounts/twitch/login`
    },
  },
}
</script>
