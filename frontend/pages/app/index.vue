<template>
  <v-row align="center">
    <v-container class="grey lighten-4">
      <h1>
        Search streamer whom you want to get clips.
      </h1>
    </v-container>
    <v-col class="grey lighten-4" cols="12" sm="4">
      <v-container class="grey lighten-5">
        <StreamerSearchForm />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "AppPage",
  head () {
    return {
      title: 'App'
    }
  }
}
</script>
