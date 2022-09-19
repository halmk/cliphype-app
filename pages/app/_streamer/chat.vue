<template>
  <ChatWithHypes :streamer="streamer" />
</template>

<script>
export default {
  name: 'StreamerChatPage',
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
