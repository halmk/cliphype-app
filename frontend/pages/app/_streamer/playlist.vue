<template>
  <ListPlaylists :streamer="streamer" />
</template>

<script>
export default {
  name: 'StreamerPlaylistPage',
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
