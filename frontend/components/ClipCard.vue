<template>
  <v-card outlined tile class="grey lighten-4 border-color">
    <v-img
      lazy-src="https://picsum.photos/id/149/10/6?blur=10"
      :src="thumbnail_url"
      @mouseover="overlay = true"
      @mouseleave="overlay = false"
    >
      <span
        class="text-subtitle-2 font-weight-bold white--text black"
        style="position:absolute; bottom:3px; right:5px; padding:1px"
      >
      {{ duration }}sec
      </span>
      <v-overlay
        absolute
        :value="overlay"
        opacity="0"
        @click="send"
        style="cursor:pointer"
      >
        <v-icon large>mdi-play</v-icon>
      </v-overlay>
    </v-img>
    <div class="text-truncate text-subtitle-1 ml-1 font-weight-bold">{{ title }}</div>
    <div class="text-subtitle-2 text--secondary ml-1">views: {{ view_count }}</div>
    <div class="text-subtitle-2 text--secondary ml-1">{{ formatted_created_at }}</div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ClipCard',
  props: {
    created_at: String,
    duration: Number,
    embed_url: String,
    id: String,
    modal: Boolean,
    modal_id: String,
    modal_target: String,
    thumbnail_url: String,
    title: String,
    url: String,
    view_count: Number,
    vod_offset: Number,
  },
  data: () => ({
    overlay: false,
  }),
  computed: {
    formatted_created_at() {
      return moment(this.created_at).format('YYYY-MM-DD HH:mm')
    }
  },
  methods: {
    send () {
      this.$emit('click', this.embed_url)
    }
  },
  mounted() {
  }
}
</script>
