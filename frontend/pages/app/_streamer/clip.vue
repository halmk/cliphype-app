<template>
  <v-container>
    <FilterStreamerClips :streamer="streamer" />
  </v-container>
</template>

<script>
export default {
  name: 'StreamerClipPage',
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
}
</script>
