<template>
  <div>
    <v-row class="mt-1">
      <v-col cols="12" lg="3">
        <h1>Clips</h1>
        <ClipDateRangePicker @input="updateDateRange" />
        <v-btn :loading="loadingGetClips" @click="getClips">Get Clips</v-btn>
        <v-btn @click="getAfterClips">More</v-btn>
      </v-col>
      <v-col cols="12" lg="9">
        <v-row justify="center" align="center" class="text-center">
          <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
          ></v-pagination>
        </v-row>
        <v-row dense class="mt-4">
          <v-col v-for="clip in shownClips" :key="clip.id" :cols="bkPoint.flex">
            <ClipCard v-bind="clip" @click="openClipDialog" />
          </v-col>
        </v-row>
        <v-row justify="center" align="center" class="text-center">
          <v-pagination
            v-model="page"
            :length="length"
            :total-visible="7"
          ></v-pagination>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
      v-model="clipDialog"
      :width="bkPoint.dialogWidth"
      dark
      hide-overlay
    >
      <iframe
        :src="embedClipUrl"
        :height="bkPoint.dialogHeight"
        :width="bkPoint.dialogWidth"
        allowfullscreen
      >
      </iframe>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ClipListView',
  props: {
    streamer: { type: String, default: '' },
  },
  data: () => ({
    dateRange: [moment().toISOString(), moment().toISOString()],
    streamerId: '',
    startedAt: '',
    endedAt: '',
    page: 1,
    size: 8,
    clips: [],
    clipsAfter: '',
    clipDialog: false,
    embedClipUrl: '',
    loadingGetClips: false,
  }),
  computed: {
    length() {
      return parseInt(this.clips.length / this.size)
    },
    shownClips() {
      const shownClips = []
      for (
        let i = this.page * this.size;
        i < (this.page + 1) * this.size;
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
        dialogHeight: 9 * 60,
        dialogWidth: 16 * 60,
      }
      switch (bkPt.name) {
        case 'md':
          point.flex = 4
          point.dialogHeight = 9 * 50
          point.dialogWidth = 16 * 50
          break
        case 'sm':
          point.flex = 4
          point.dialogHeight = 9 * 40
          point.dialogWidth = 16 * 40
          break
        case 'xs':
          point.flex = 6
          point.dialogHeight = 9 * 20
          point.dialogWidth = 16 * 20
          break
        default:
          break
      }
      return point
    },
  },
  mounted() {
    this.getStreamerId()
  },
  methods: {
    updateDateRange(value) {
      this.dateRange = value
    },

    getStreamerId() {
      this.$twitch
        .getUserId(this.streamer)
        .then((response) => {
          const data = response.data.response.data
          console.log(response.data.response.data[0])
          this.streamerId = data[0].id
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    getClips() {
      this.loadingGetClips = true
      console.log(
        'getClips params: ',
        this.streamerId,
        this.dateRange[0],
        this.dateRange[1]
      )
      this.$twitch
        .getClips(this.streamerId, this.dateRange[0], this.dateRange[1])
        .then((response) => {
          console.log(response)
          const data = response.data.response.data
          for (let i = 0; i < data.length; i++) {
            data[i].modal_id = 'modal' + data[i].id
            data[i].modal_target = '#' + data[i].modal_id
            data[i].embed_url += `&autoplay=false&parent=${this.$config.domain}`
            data[i].modal = false
            // clips[i].created_date = this.customformat(clips[i].created_at);
            // clips[i].created_epoch = this.getEpochTime(clips[i].created_at);
          }
          this.clips = data
          this.clipsAfter = response.data.response.pagination.cursor
          this.loadingGetClips = false
        })
        .catch(function (error) {
          console.log(error)
          this.loadingGetClips = false
        })
    },

    getAfterClips() {
      // console.log("after : " + this.clipsAfter);
      if (!this.clipsAfter) {
        alert('No more clips!')
        return
      }
      this.$twitch
        .getAfterClips(
          this.streamerId,
          this.dateRange[0],
          this.dateRange[1],
          this.clipsAfter
        )
        .then((response) => {
          // console.log(response);
          const data = response.data.response.data

          for (let i = 0; i < data.length; i++) {
            data[i].modal_id = 'modal' + data[i].id
            data[i].modal_target = '#' + data[i].modal_id
            data[i].embed_url += `&autoplay=false&parent=${this.$config.domain}`
            data[i].modal = false
            // data[i].created_date = this.customformat(data[i].created_at);
            // data[i].created_epoch = this.getEpochTime(data[i].created_at);
          }
          // Array.prototype.push.apply(app.clips, data);
          for (let i = 0; i < data.length; i++) {
            this.clips.push(data[i])
          }
          this.clipsAfter = response.data.response.pagination.cursor
        })
        .catch(function (error) {
          // console.log("getAfterClips:失敗");
          console.log(error)
        })
    },

    openClipDialog(embedUrl) {
      this.embedClipUrl = embedUrl
      this.clipDialog = true
    },
  },
}
</script>
