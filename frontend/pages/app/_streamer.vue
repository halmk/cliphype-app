<template>
  <div>
    <v-row align="center">
      <v-col class="" cols="12">
        <v-container>
          <h1>
            {{ streamer }}
          </h1>
          <v-tabs v-model="activeTab">
            <v-tab v-for="tab of tabs" :key="tab.id" :to="tab.route" exact nuxt>
              {{ tab.name }}
            </v-tab>

            <v-tab-item v-for="tab of tabs" :key="tab.id" :value="tab.route">
              <nuxt-child></nuxt-child>
            </v-tab-item>
          </v-tabs>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'StreamerPage',
  asyncData({ params }) {
    return {
      activeTab: `/app/${params.streamer}/clip`,
      tabs: [
        { id: 1, name: 'Clip', route: `/app/${params.streamer}/clip` },
        { id: 2, name: 'Playlist', route: `/app/${params.streamer}/playlist` },
      ],
    }
  },
  data: () => ({}),
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
    this.$router.push(`/app/${this.$route.params.streamer}/clip`)
  },
}
</script>
