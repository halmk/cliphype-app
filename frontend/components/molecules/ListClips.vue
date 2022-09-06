<template>
  <div>
    <v-row justify="center" align="center" class="text-center">
      <v-pagination
        v-model="page"
        :length="length"
        :total-visible="7"
      ></v-pagination>
    </v-row>
    <v-row dense class="mt-4">
      <v-col
        v-for="(clip, index) in shownClips"
        :key="clip.id"
        :cols="bkPoint.flex"
      >
        <v-skeleton-loader
          v-if="!showCard"
          type="image, list-item-three-line, actions"
        >
        </v-skeleton-loader>
        <ClipCard
          v-show="showCard"
          v-bind="clip"
          :index="index"
          @click="send"
          @clickPlus="clickPlus"
        />
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="text-center">
      <v-pagination
        v-model="page"
        :length="length"
        :total-visible="7"
      ></v-pagination>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ClipDateRangePicker',
  props: {
    clips: Array,
  },
  data: () => ({
    page: 1,
    showCard: true,
  }),
  computed: {
    length() {
      return parseInt(this.clips.length / this.size)
    },
    size() {
      return (12 / this.bkPoint.flex) * this.bkPoint.rows
    },
    shownClips() {
      const shownClips = []
      for (
        let i = (this.page - 1) * this.size;
        i < this.page * this.size;
        i++
      ) {
        if (i >= this.clips.length) return shownClips
        shownClips.push(this.clips[i])
      }
      return shownClips
    },
    bkPoint() {
      const bkPt = this.$vuetify.breakpoint
      const point = {
        flex: 3,
        rows: 2,
      }
      switch (bkPt.name) {
        case 'md':
          point.flex = 4
          point.rows = 3
          break
        case 'sm':
          point.flex = 4
          point.rows = 3
          break
        case 'xs':
          point.flex = 6
          point.rows = 3
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
    send(embedURL) {
      this.$emit('click', embedURL)
    },
    clickPlus(index) {
      this.$emit('clickPlus', index)
    },
    loading() {
      this.showCard = false
      setTimeout(() => {
        this.showCard = true
      }, 1200)
    },
  },
}
</script>
