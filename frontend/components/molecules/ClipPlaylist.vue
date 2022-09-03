<template>
  <div>
    <v-btn @click.stop="drawer = !drawer">Open Playlist</v-btn>
    <v-navigation-drawer v-model="drawer" right temporary fixed width="256">
      <v-list dense nav>
        <v-list-item>
          <v-list-item-title>Playlist</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <div class="mt-3 ml-3">
        <v-btn @click="clickSort">sort</v-btn>
        <v-btn :disabled="disabled" color="primary" @click="clickPublish"
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
      <v-list>
        <transition-group name="swap-list" tag="p">
          <v-list-item
            v-for="(playlistClip, index) in clips"
            :key="playlistClip.id"
          >
            <div class="mt-1">
              <PlaylistClipCard
                v-bind="playlistClip"
                :max-width="220"
                :index="index"
                @clickPlay="playEmbedClip"
                @clickRemove="removeClip"
                @clickPrev="swapPrevClip"
                @clickNext="swapNextClip"
              />
            </div>
          </v-list-item>
        </transition-group>
      </v-list>
    </v-navigation-drawer>
    <ClipDialog
      class=""
      :embed-clip-u-r-l="embedClipURL"
      :show-dialog="showDialog"
      @close="showDialog = false"
    >
      <div class="move-button">
        <v-btn small @click="movePrevClip">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn small @click="moveNextClip">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
      <div class="ml-1 mb-1">
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
    </ClipDialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ClipPlaylist',
  props: {
    clips: Array,
  },
  data: () => ({
    index: 0,
    drawer: false,
    title: '',
    rules: [
      (value) => !!value || 'Required.',
      (value) => (value && value.length >= 3) || 'Min 3 characters',
    ],
    overlay: false,
    embedClipURL: '',
    showDialog: false,
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
  },
  mounted() {},
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
    playEmbedClip(index) {
      this.index = index
      this.embedClipURL = this.clips[index].embed_url
      this.currentClipDuration = this.clips[index].duration
      this.showDialog = true
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

<style scoped>
.swap-list-move {
  transition: transform 0.8s ease;
}

.swap-list-enter-from,
.swap-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.swap-list-leave-active {
  position: absolute;
}

.move-button {
  text-align: center;
}
</style>
