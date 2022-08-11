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
        style="position: absolute; bottom: 3px; right: 5px; padding: 1px"
      >
        {{ duration }}
      </span>
      <v-overlay
        absolute
        :value="overlay"
        opacity="0"
        style="cursor: pointer"
        @click="send"
      >
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
  name: 'VideoCard',
  props: {
    created_at: String,
    duration: String,
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
    getArchiveDateRange() {
      const createdAt = this.created_at
      let duration = this.duration
      const pattern = /[hms]/
      duration = duration.split(pattern) // [hour,minutes,seconds,""] or [minutes,seconds,""] or [seconds,""]
      let hour = 0
      let min = 0
      let sec = 0

      if (duration.length === 4) {
        hour = +duration[0]
        min = +duration[1]
        sec = +duration[2]
      } else if (duration.length === 3) {
        min = +duration[0]
        sec = +duration[1]
      } else if (duration.length === 2) {
        sec = +duration[0]
      } else {
        console.log('Error : ' + duration)
      }

      const m = moment(createdAt)
      const startMoment = m
      const startedAt = startMoment.toISOString()

      m.add({ hours: hour, minutes: min, seconds: sec })
      const endMoment = m
      const endedAt = endMoment.toISOString()

      return [startedAt, endedAt]
    },

    send() {
      const dateRange = this.getArchiveDateRange()
      this.$emit('click', dateRange)
    },
  },
}
</script>
