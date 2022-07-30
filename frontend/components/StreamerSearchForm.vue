<template>
  <div>
    <v-text-field
      v-model="streamer_id"
      label="Streamer ID"
      placeholder="shroud"
      append-outer-icon="mdi-magnify"
      clearable
      tyep="text"
      @click:append-outer="moveStreamerClipPage"
      hide-details
      filled
      dense
      outlined
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'StreamerSearchForm',
  data: () => ({
    streamer_id: ''
  }),
  methods: {
    moveStreamerClipPage () {
      window.alert(this.streamer_id)
    }
  }
}
</script>
