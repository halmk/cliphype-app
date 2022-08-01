<template>
  <div>
    <v-text-field
      v-model="streamer_id"
      label="Streamer ID"
      placeholder="shroud"
      append-outer-icon="mdi-magnify"
      clearable
      tyep="text"
      hide-details
      filled
      dense
      outlined
      @click:append-outer="moveStreamerPage"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'StreamerSearchForm',
  data: () => ({
    streamer_id: '',
  }),
  methods: {
    moveStreamerPage() {
      console.log(this.$twitch.apiUrl)
      this.$twitch.getUserId(this.streamer_id)
        .then(function(response) {
          console.log(response)
          this.$router.push('/app')
        })
    },
  },
  mounted() {
  }
}
</script>
