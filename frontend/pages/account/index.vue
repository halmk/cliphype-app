<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="" cols="12" sm="8" md="10" lg="12">
        <NuxtLink to="/account/login">Login</NuxtLink>
        <NuxtLink to="/account/logout">Logout</NuxtLink>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'AccountIndexPage',
  middleware: 'auth',
  head() {
    return {
      title: 'Home',
    }
  },
}
</script>
