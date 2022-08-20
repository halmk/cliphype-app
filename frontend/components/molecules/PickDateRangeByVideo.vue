<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h3>Select the range from archives</h3>
        <v-row justify="center" align="center" class="mt-2 text-center">
          <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
          ></v-pagination>
        </v-row>
        <v-row dense class="mt-4">
          <v-col
            v-for="video in shownVideos"
            :key="video.id"
            :cols="bkPoint.flex"
          >
            <v-skeleton-loader
              v-if="!showCard"
              type="image, list-item-three-line"
            ></v-skeleton-loader>
            <VideoCard v-show="showCard" v-bind="video" @click="send" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'PickDateRangeByVideo',
  props: {
    videos: Array,
  },
  data: () => ({
    dateRange: [moment().toISOString(), moment().toISOString()],
    page: 1,
    showCard: true,
  }),
  computed: {
    length() {
      return parseInt(this.videos.length / this.size)
    },
    size() {
      return 12 / this.bkPoint.flex
    },
    shownVideos() {
      const shownVideos = []
      for (
        let i = (this.page - 1) * this.size;
        i < this.page * this.size;
        i++
      ) {
        if (i >= this.videos.length) return shownVideos
        shownVideos.push(this.videos[i])
      }
      return shownVideos
    },
    bkPoint() {
      const bkPt = this.$vuetify.breakpoint
      const point = {
        flex: 3,
      }
      switch (bkPt.name) {
        case 'md':
          point.flex = 4
          break
        case 'sm':
          point.flex = 4
          break
        case 'xs':
          point.flex = 6
          break
        default:
          break
      }
      return point
    },
  },
  mounted() {
    this.loading()
  },
  methods: {
    send(dateRange) {
      this.$emit('click', dateRange)
    },
    loading() {
      this.showCard = false
      setTimeout(() => {
        this.showCard = true
      }, 1500)
    },
  },
}
</script>
