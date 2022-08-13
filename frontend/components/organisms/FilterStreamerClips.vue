<template>
  <div>
    <v-row class="mt-1">
      <v-col cols="12">
        <div class="px-3 pt-3 mt-4 rounded-lg elevation-1 grey lighten-5">
          <PickDateRangeByCalendar @input="updateDateRange" />
        </div>
        <div class="px-2 pb-2 mt-5 rounded-lg elevation-1 grey lighten-5">
          <PickDateRangeByVideo :videos="videos" @click="updateDateRange" />
        </div>
        <div class="mt-4">
          <span
            class="text-h6 font-weight-bold pa-2 rounded-lg elevation-1 grey lighten-5"
          >
            {{ dateRangeText }}
          </span>
        </div>
        <div class="mt-3">
          <v-btn
            class="grey lighten-5"
            :loading="loadingGetClips"
            @click="getClips"
            >Get Clips</v-btn
          >
          <v-btn class="grey lighten-5" @click="getAfterClips">More</v-btn>
        </div>
        <div class="pt-1 pb-4 px-2 mt-5 rounded-lg elevation-1 grey lighten-5">
          <h1>Clips</h1>
          <ListClips :clips="clips" @click="openClipDialog" />
        </div>
      </v-col>
    </v-row>
    <ClipDialog
      :show-dialog="showDialog"
      :embed-clip-u-r-l="embedClipURL"
      @close="showDialog = !showDialog"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'FilterStreamerClips',
  props: {
    streamer: { type: String, default: '' },
  },
  data: () => ({
    dateRange: [moment().toISOString(), moment().toISOString()],
    streamerId: '',
    clips: [],
    clipsAfter: '',
    videos: [],
    showDialog: false,
    embedClipURL: '',
    loadingGetClips: false,
  }),
  computed: {
    dateRangeText() {
      const dateRange = [
        moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm'),
        moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm'),
      ]
      return dateRange.join(' ~ ')
    },
  },
  async mounted() {
    this.$twitch.apiURL = `${this.$config.apiURL}/api/twitch`
    await this.getStreamerId()
    await this.getVideos()
    await this.getClips()
  },
  methods: {
    updateDateRange(value) {
      this.dateRange = value
    },

    async getStreamerId() {
      try {
        const response = await this.$twitch.getUserId(this.streamer)
        console.log(response.data)
        const data = response.data.response.data
        console.log(data)
        this.streamerId = data[0].id
      } catch (error) {
        console.log(error)
      }
    },

    async getClips() {
      this.loadingGetClips = true
      console.log(
        'getClips params: ',
        this.streamerId,
        this.dateRange[0],
        this.dateRange[1]
      )
      try {
        const response = await this.$twitch.getClips(
          this.streamerId,
          this.dateRange[0],
          this.dateRange[1]
        )
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
      } catch (error) {
        console.log(error)
      }
      this.loadingGetClips = false
    },

    async getAfterClips() {
      // console.log("after : " + this.clipsAfter);
      if (!this.clipsAfter) {
        alert('No more clips!')
        return
      }
      try {
        const response = await this.$twitch.getAfterClips(
          this.streamerId,
          this.dateRange[0],
          this.dateRange[1],
          this.clipsAfter
        )
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
      } catch (error) {
        // console.log("getAfterClips:失敗");
        console.log(error)
      }
    },

    async getVideos() {
      console.log('getVideos params: ', this.streamerId)
      try {
        const response = await this.$twitch.getVideos(this.streamerId)
        console.log(response)
        const data = response.data.response.data
        for (let i = 0; i < data.length; i++) {
          const thumbnailUrl = data[i].thumbnail_url
          if (thumbnailUrl === '') {
            data[i].thumbnail_url =
              'https://vod-secure.twitch.tv/_404/404_processing_320x180.png'
          } else {
            data[i].thumbnail_url = thumbnailUrl.replace(
              '-%{width}x%{height}',
              '-320x180'
            )
          }
        }
        this.videos = data
      } catch (error) {
        console.log(error)
      }
    },

    openClipDialog(embedURL) {
      this.embedClipURL = embedURL
      this.showDialog = true
    },
  },
}
</script>
