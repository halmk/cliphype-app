<template>
  <v-card :max-width="maxWidth" tile>
    <v-img
      lazy-src="https://picsum.photos/id/149/10/6?blur=10"
      :src="thumbnail_url"
      @mouseover="overlay = true"
      @mouseleave="overlay = false"
    >
      <span
        class="text-subtitle-2 font-weight-bold white--text black"
        style="position: absolute; bottom: 3px; right: 5px; padding: 1px"
      >
        {{ duration }}sec
      </span>
      <v-overlay absolute :value="overlay" opacity="0">
        <div class="playlist-clip-index">{{ index + 1 }}</div>
        <div class="playlist-clip-play">
          <v-icon @click="clickPlay">mdi-play</v-icon>
        </div>
        <div class="playlist-clip-prev">
          <v-icon @click="clickPrev">mdi-chevron-up</v-icon>
        </div>
        <div class="playlist-clip-next">
          <v-icon @click="clickNext">mdi-chevron-down</v-icon>
        </div>
        <div class="playlist-clip-remove">
          <v-icon @click="clickRemove">mdi-close</v-icon>
        </div>
      </v-overlay>
    </v-img>
    <div class="text-truncate text-subtitle-1 ml-1 font-weight-bold">
      {{ title }}
    </div>
    <div class="text-subtitle-2 text--secondary ml-1">
      views: {{ view_count }}
    </div>
    <div class="text-subtitle-2 text--secondary ml-1">
      {{ formatted_created_at }}
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  name: 'PlaylistClipCard',
  props: {
    index: Number,
    maxWidth: Number,
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
    },
  },
  mounted() {},
  methods: {
    clickPlay() {
      this.$emit('clickPlay', this.index)
    },
    clickRemove() {
      this.$emit('clickRemove', this.index)
    },
    clickPrev() {
      this.$emit('clickPrev', this.index)
    },
    clickNext() {
      this.$emit('clickNext', this.index)
    },
  },
}
</script>

<style scoped>
.playlist-clip-index {
  background: rgb(0 0 0 / 50%);
  font-size: 1.4em;
  position: absolute;
  top: -16px;
  left: -6px;
}

.playlist-clip-play {
  background: rgb(0 0 0 / 30%);
  border-radius: 50%;
  font-size: 1.5em;
  position: absolute;
  top: -65px;
  left: -105px;
  cursor: pointer;
}

.playlist-clip-remove {
  background: rgb(0 0 0 / 30%);
  border-radius: 50%;
  font-size: 1.4em;
  position: absolute;
  top: -65px;
  left: 80px;
  cursor: pointer;
}

.playlist-clip-prev {
  background: rgb(0 0 0 / 30%);
  border-radius: 10%;
  font-size: 1.2em;
  position: absolute;
  top: 10px;
  left: -105px;
  cursor: pointer;
}

.playlist-clip-next {
  background: rgb(0 0 0 / 30%);
  border-radius: 10%;
  font-size: 1.2em;
  position: absolute;
  top: 30px;
  left: -105px;
  cursor: pointer;
}
</style>
