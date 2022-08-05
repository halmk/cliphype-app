<template>
  <div>
    <v-text-field
      v-model="streamerId"
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
    streamerId: '',
  }),
  methods: {
    moveStreamerPage() {
      console.log(this.$twitch.apiUrl)
      this.$twitch.getUserId(this.streamerId)
        .then((response) => {
          console.log(response)
          this.$router.push(`/app/${this.streamerId}`)
        })
    },
  },
  mounted() {
  }
}
</script>
