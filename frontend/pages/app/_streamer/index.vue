<template>
  <div>
    <v-row align="center">
      <v-col class="" cols="12">
        <v-container>
          <h1>
            {{ streamer }}
          </h1>
          <v-tabs v-model="tab">
            <v-tab>Clip</v-tab>
            <v-tab>Playlist</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-container>
                <FilterStreamerClips :streamer="streamer" />
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <ListPlaylists :streamer="streamer" />
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'AppPage',
  data: () => ({
    tab: null,
  }),
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
