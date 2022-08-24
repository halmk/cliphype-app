<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="mx-auto" sm="6" md="6" lg="4">
        <v-card>
          <v-card-title class="justify-center text-h4">
            Log in to Cliphype
          </v-card-title>
          <v-card-text class="text-center">
            <TwitchSocialLogin />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  middleware: 'auth',
  head() {
    return {
      title: 'Login',
    }
  },
}
</script>
