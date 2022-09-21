<template>
  <PlaylistDialog
    :clips="clips"
    :show="show"
    :loading="loading"
    editable
    @clickClose="closePlaylist"
    @clickPublish="clickPublish"
    @clickSort="clickSort"
    @changeTitle="changeTitle"
    @clickPrev="swapPrevClip"
    @clickNext="swapNextClip"
    @clickRemove="removeClip"
  ></PlaylistDialog>
</template>

<script>
export default {
  name: 'ClipPlaylist',
  props: {
    clips: Array,
    show: Boolean,
    loading: Boolean,
  },
  data: () => ({}),
  methods: {
    clickSort() {
      this.$emit('clickSort')
    },
    clickPublish() {
      this.$emit('clickPublish')
    },
    changeTitle(title) {
      this.$emit('changeTitle', title)
    },
    closePlaylist() {
      this.$emit('clickClose')
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
  },
}
</script>
