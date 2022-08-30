<template>
  <div>
    <v-row class="mt-1">
      <v-col cols="12">
        <div class="pb-3 grey darken-4">
          <v-col
            sm="6"
            md="4"
            lg="3"
            class="px-1 mx-1 pt-3 rounded-lg elevation-1"
          >
            <PickDateRangeByCalendar @input="updateDateRange" />
          </v-col>
          <div class="px-2 pb-2 mt-5 rounded-lg elevation-1">
            <PickDateRangeByVideo :videos="videos" @click="updateDateRange" />
          </div>
        </div>
        <div class="mt-4">
          <span class="text-h6 font-weight-bold pa-2 rounded-lg elevation-1">
            {{ dateRangeText }}
          </span>
        </div>
        <div class="mt-3">
          <v-btn :loading="loadingGetClips" @click="getClips">Get Clips</v-btn>
          <v-btn @click="getAfterClips">More</v-btn>
        </div>
        <div class="pt-1 pb-4 px-2 mt-5 rounded-lg elevation-1">
          <h1>Clips</h1>
          <ListClips
            :clips="clips"
            @click="openClipDialog"
            @clickPlus="addClipToPlaylist"
          />
        </div>
      </v-col>
    </v-row>
    <ClipDialog
      :show-dialog="showDialog"
      :embed-clip-u-r-l="embedClipURL"
      @close="showDialog = !showDialog"
    />
    <div class="mt-4">
      <ClipPlaylist
        :clips="playlistClips"
        @clickRemove="removeClip"
        @clickPrev="swapPrevClip"
        @clickNext="swapNextClip"
        @clickSort="sortPlaylistClipsByCreatedAt"
      />
    </div>
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
    playlistClips: [],
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
        const response = await this.$twitch.app.getUserId(this.streamer)
        // console.log(response.data)
        const data = response.data.response.data
        // console.log(data)
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
        const response = await this.$twitch.app.getClips(
          this.streamerId,
          this.dateRange[0],
          this.dateRange[1]
        )
        // console.log(response)
        const data = response.data.response.data
        for (let i = 0; i < data.length; i++) {
          data[i].modal_id = 'modal' + data[i].id
          data[i].modal_target = '#' + data[i].modal_id
          data[i].embed_url += `&autoplay=true&parent=${this.$config.domain}`
          data[i].modal = false
          data[i].created_epoch = moment(data[i].created_at).unix()
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
        const response = await this.$twitch.app.getAfterClips(
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
          data[i].embed_url += `&autoplay=true&parent=${this.$config.domain}`
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
        const response = await this.$twitch.app.getVideos(this.streamerId)
        // console.log(response)
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

    removeClip(index) {
      this.playlistClips.splice(index, 1)
    },

    swapPrevClip(index) {
      if (index > 0) {
        this.playlistClips.splice(
          index - 1,
          2,
          this.playlistClips[index],
          this.playlistClips[index - 1]
        )
      }
    },

    swapNextClip(index) {
      if (index + 1 < this.clips.length) {
        this.playlistClips.splice(
          index,
          2,
          this.playlistClips[index + 1],
          this.playlistClips[index]
        )
      }
    },

    addClipToPlaylist(id) {
      const clip = this.clips.filter((value) => value.id === id)[0]
      this.playlistClips.push(clip)
    },

    sortPlaylistClipsByCreatedAt() {
      this.playlistClips.sort((a, b) => a.created_epoch - b.created_epoch)
    },
  },
}
</script>

<style>
.v-dialog {
  background-color: black;
  box-shadow: none;
  border: 0;
}
</style>
