<template>
  <div>
    <v-row justify="center" align="center">
      <v-col class="mx-auto" sm="6" md="6" lg="4">
        <v-card>
          <v-card-text class="text-center">
            <LogoutButton />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'LogoutPage',
  head() {
    return {
      title: 'Logout',
    }
  },
}
</script>
