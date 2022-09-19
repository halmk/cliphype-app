<template>
  <v-row align="center">
    <v-container>
      <h1>Search streamer whom you want to get clips.</h1>
    </v-container>
    <v-col cols="12" sm="4">
      <v-container>
        <StreamerSearchForm />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AppPage',
  head() {
    return {
      title: 'App',
    }
  },
}
</script>
