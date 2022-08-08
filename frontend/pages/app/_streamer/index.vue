<template>
  <v-row align="center" class="grey lighten-5">
    <v-col class="" cols="12">
      <v-container class="">
        <h1>
          {{ streamer }}
        </h1>
        <ClipListView :streamer="streamer"/>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AppPage',
  head () {
    return {
      title: this.streamer
    }
  },
  computed: {
    streamer () {
      return this.$route.params.streamer
    }
  }
}
</script>
