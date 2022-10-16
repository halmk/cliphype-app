<template>
  <v-container>
    <StreamerAutoClips :streamer="streamer" />
  </v-container>
</template>

<script>
export default {
  name: 'StreamerAutoClipPage',
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
