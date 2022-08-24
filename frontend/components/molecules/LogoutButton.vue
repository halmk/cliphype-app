<template>
  <v-btn color="primary" class="ma-2 white--text" @click.stop="logout">
    <v-icon left> mdi-logout </v-icon>
    Logout
  </v-btn>
</template>

<script>
export default {
  name: 'LogoutButton',
  methods: {
    logout() {
      window.location.href = `${this.$config.apiURL}/accounts/logout`
    },
  },
}
</script>
