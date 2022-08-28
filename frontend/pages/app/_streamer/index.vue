<template>
  <div>
    <v-row align="center" class="grey lighten-4">
      <v-col class="" cols="12">
        <v-container class="">
          <h1>
            {{ streamer }}
          </h1>
          <FilterStreamerClips :streamer="streamer" />
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'AppPage',
  head() {
    return {
      title: this.streamer,
    }
  },
  computed: {
    streamer() {
      return this.$route.params.streamer
    },
  },
  mounted() {
    this.$twitch.apiURL = `${this.$config.apiURL}/api/twitch`
  },
}
</script>
