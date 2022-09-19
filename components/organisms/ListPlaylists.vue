<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="playlists"
      :items-per-page="itemsPerPage"
      :sort-by="'createdAt'"
      :sort-desc="true"
    >
      <template #[`item.thumbnail`]="{ item, index }">
        <v-img
          :src="item.thumbnail"
          :aspect-ratio="16 / 9"
          min-height="10px"
          width="140px"
          min-width="10px"
          class="ma-0 pa-0"
          @mouseover="$set(overlays, index, true)"
          @mouseleave="$set(overlays, index, false)"
        >
          <v-overlay
            absolute
            :value="overlays[index]"
            opacity="0.2"
            style="cursor: pointer"
            @click.stop="openDialog(item.id)"
          >
            <v-icon large>mdi-play</v-icon>
          </v-overlay>
        </v-img>
      </template>
    </v-data-table>
    <PlaylistDialog
      :clips="clips"
      :show="showDialog"
      @clickClose="showDialog = false"
    ></PlaylistDialog>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'ListPlaylists',
  props: {
    streamer: String,
  },
  data: () => ({
    headers: [
      { text: '', value: 'thumbnail', width: '140px' },
      { text: 'Title', value: 'title' },
      { text: 'Views', value: 'views' },
      { text: 'Duration [sec]', value: 'totalDuration' },
      { text: 'Clips', value: 'numClips' },
      { text: 'Created at', value: 'createdAt' },
    ],
    playlists: [],
    itemsPerPage: 10,
    loading: false,
    error: false,
    overlays: [],
    clips: [],
    showDialog: false,
  }),
  computed: {},
  mounted() {
    this.getPlaylists()
    this.overlays = new Array(this.itemsPerPage).fill(false)
  },
  methods: {
    async getPlaylists() {
      try {
        const response = await axios.get(
          `${this.$config.apiURL}/api/playlists`,
          {
            params: {
              streamer: this.streamer,
            },
          }
        )
        this.playlists = new Array(response.data.length)
        for (let i = 0; i < this.playlists.length; i++) {
          this.playlists[i] = {
            id: response.data[i].playlist.id,
            title: response.data[i].playlist.title,
            creator: response.data[i].playlist.creator,
            createdAt: moment(response.data[i].playlist.createdAt).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
            thumbnail: response.data[i].clips[0].thumbnail_url,
            totalDuration: parseInt(
              response.data[i].clips.reduce(
                (sum, clip) => sum + clip.duration,
                0
              )
            ),
            numClips: response.data[i].clips.length,
            views: response.data[i].playlist.viewCount,
            clips: response.data[i].clips,
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    openDialog(id) {
      this.showDialog = true
      this.clips = this.playlists.filter(
        (playlist) => playlist.id === id
      )[0].clips
    },
  },
}
</script>
