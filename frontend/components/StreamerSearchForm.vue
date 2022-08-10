<template>
  <div>
    <v-text-field
      v-model="streamerId"
      :loading="loading"
      :error="error"
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
    loading: false,
    error: false,
  }),
  watch: {
    streamerId() {
      this.error = false
    },
  },
  mounted() {},
  methods: {
    moveStreamerPage() {
      this.loading = true
      this.$twitch
        .getUserId(this.streamerId)
        .then((response) => {
          this.loading = false
          console.log(response)
          const data = response.data.response.data
          if (data.length === 0) {
            console.log(data)
            this.error = true
          } else {
            this.$router.push(`/app/${this.streamerId}`)
          }
        })
        .catch((error) => {
          console.log(error)
          this.loading = false
          this.error = true
        })
    },
  },
}
</script>
