<template>
  <div>
    <ClipDialog
      class=""
      :embed-clip-u-r-l="formattedEmbedURL"
      :show-dialog="show"
      @close="clickClose"
    >
      <div class="move-button">
        <v-btn small @click="movePrevClip">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn small @click="moveNextClip">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
      <div class="mt-2 ml-1 mb-1">
        <v-btn small @click="additionalTime--">
          <v-icon small>mdi-minus</v-icon>
        </v-btn>
        <v-btn v-if="isAutoplaying" small @click="stopAutoplay">
          {{ remainingTimeTillNextClip }}(+{{ additionalTime }})
        </v-btn>
        <v-btn v-else small @click="startAutoplay">auto</v-btn>
        <v-btn small @click="additionalTime++">
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </div>
      <div v-show="editable" class="mt-3">
        <div class="mt-3 ml-3">
          <v-btn @click="clickSort">sort</v-btn>
          <v-btn
            :disabled="disabled"
            :loading="loading"
            color="primary"
            @click="clickPublish"
            >publish</v-btn
          >
        </div>
        <div class="ma-3 mb-4">
          <v-text-field
            :value="title"
            label="Title"
            :rules="rules"
            hide-details="auto"
            @input="changeTitle"
          ></v-text-field>
        </div>
      </div>
      <div>
        <v-data-table
          v-model="playings"
          :headers="showHeaders"
          :items="clips"
          :mobile-breakpoint="300"
          disable-sort
          disable-pagination
          hide-default-footer
        >
          <template #[`item.index`]="{ index }">
            <span v-if="playings[index]">
              <v-icon small>mdi-play</v-icon>
            </span>
            <span v-else>
              {{ index + 1 }}
            </span>
          </template>
          <template #[`item.thumbnail_url`]="{ item, index }">
            <v-img
              :src="item.thumbnail_url"
              :aspect-ratio="16 / 9"
              min-height="10px"
              width="120px"
              min-width="10px"
              class="ma-0 pa-0"
              @mouseover="$set(overlays, index, true)"
              @mouseleave="$set(overlays, index, false)"
            >
              <v-overlay
                absolute
                :value="overlays[index] || playings[index]"
                opacity="0.2"
                style="cursor: pointer"
                @click.stop="playEmbedClip(index)"
              >
                <v-icon v-if="overlays[index]" large>mdi-play</v-icon>
              </v-overlay>
            </v-img>
          </template>
          <template #[`item.actions`]="{ index }">
            <div v-show="editable">
              <v-icon small class="" @click="swapPrevClip(index)">
                mdi-chevron-up
              </v-icon>
              <v-icon small class="" @click="swapNextClip(index)">
                mdi-chevron-down
              </v-icon>
              <v-icon small class="ml-2" @click="removeClip(index)">
                mdi-delete
              </v-icon>
            </div>
          </template>
        </v-data-table>
      </div>
    </ClipDialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'PlaylistDialog',
  props: {
    clips: Array,
    show: Boolean,
    loading: Boolean,
    editable: { type: Boolean, default: false },
  },
  data: () => ({
    title: '',
    headers: [
      { text: '', value: 'index', width: '20px' },
      { text: '', value: 'thumbnail_url', width: '120px' },
      { text: 'Title', value: 'title' },
      { text: 'Actions', value: 'actions', sortable: false, width: '120px' },
    ],
    rules: [
      (value) => !!value || 'Required.',
      (value) => (value && value.length >= 3) || 'Min 3 characters',
    ],
    overlays: [],
    playings: [],
    index: 0,
    embedClipURL: '',
    currentClipDuration: 0,
    additionalTime: 0,
    isAutoplaying: false,
    clipStartedAt: 0,
    autoplayTimer: -1,
    remainingTimeTillNextClip: -1,
  }),
  computed: {
    disabled() {
      return this.clips.length <= 1 || this.title.length < 3
    },
    formattedEmbedURL() {
      if (!this.embedClipURL) return null
      let formatted = this.embedClipURL
      if (!formatted.includes('autoplay')) {
        formatted += '&autoplay=true'
      }
      if (!formatted.includes('parent')) {
        formatted += `&parent=${this.$config.domain}`
      }
      return formatted
    },
    selectedHeaders() {
      const selectedHeaders = ['index', 'thumbnail_url', 'title']
      if (this.editable) {
        selectedHeaders.push('actions')
      }
      return selectedHeaders
    },
    showHeaders() {
      return this.headers.filter((header) =>
        this.selectedHeaders.includes(header.value)
      )
    },
  },
  watch: {
    show(newShow, oldShow) {
      if (newShow && !oldShow) {
        this.index = 0
        this.embedClipURL = this.clips[0].embed_url
        this.overlays = new Array(this.clips.length).fill(false)
        this.playings = new Array(this.clips.length).fill(false)
        this.playings[this.index] = true
      }
      if (!newShow && oldShow) {
        this.index = 0
        this.embedClipURL = null
        this.overlays = new Array(this.clips.length).fill(false)
        this.playings = new Array(this.clips.length).fill(false)
      }
    },
    index(newIndex, oldIndex) {
      this.$set(this.playings, newIndex, true)
      this.$set(this.playings, oldIndex, false)
    },
  },
  methods: {
    clickSort() {
      this.$emit('clickSort')
    },
    clickPublish() {
      this.$emit('clickPublish')
    },
    changeTitle(title) {
      this.title = title
      this.$emit('changeTitle', title)
    },
    clickClose() {
      this.$emit('clickClose')
    },
    playEmbedClip(index) {
      this.index = index
      this.embedClipURL = this.clips[index].embed_url
      this.currentClipDuration = this.clips[index].duration
    },
    removeClip(index) {
      this.$emit('clickRemove', index)
    },
    swapPrevClip(index) {
      this.$emit('clickPrev', index)
    },
    swapNextClip(index) {
      this.$emit('clickNext', index)
    },
    movePrevClip() {
      if (this.index > 0) {
        this.index--
        this.currentClipDuration = this.clips[this.index].duration
        this.embedClipURL = this.clips[this.index].embed_url
      }
    },
    moveNextClip() {
      if (this.index + 1 < this.clips.length) {
        this.clipStartedAt = moment().valueOf()
        this.index++
        this.currentClipDuration = this.clips[this.index].duration
        this.embedClipURL = this.clips[this.index].embed_url
      }
    },
    calcRemainingTimeTillNextClip() {
      const current = moment().valueOf()
      const elapsed = (current - this.clipStartedAt) / 1000.0
      const remainingTime =
        this.currentClipDuration + this.additionalTime - elapsed
      this.remainingTimeTillNextClip = Math.floor(remainingTime)
      if (this.remainingTimeTillNextClip <= 0) {
        if (this.index === this.clips.length - 1) this.stopAutoplay()
        else this.moveNextClip()
      }
    },
    calcRemainingTimeTillNextClipInterval() {
      this.clipStartedAt = moment().valueOf()
      this.autoplayTimer = setInterval(this.calcRemainingTimeTillNextClip, 200)
    },
    startAutoplay() {
      this.isAutoplaying = true
      this.clipStartedAt = moment().valueOf()
      this.calcRemainingTimeTillNextClipInterval()
    },
    stopAutoplay() {
      this.isAutoplaying = false
      clearInterval(this.autoplayTimer)
    },
  },
}
</script>
