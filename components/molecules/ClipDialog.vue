<template>
  <v-dialog
    :value="showDialog"
    :width="bkPoint.dialogWidth"
    @click:outside="close"
    @keydown="close"
  >
    <iframe
      :src="embedClipURL"
      :height="bkPoint.dialogHeight"
      :width="bkPoint.dialogWidth"
      frameborder="0"
      allowfullscreen
    >
    </iframe>
    <div style="overflow-x: hidden">
      <slot></slot>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'ClipDialog',
  props: {
    embedClipURL: String,
    showDialog: Boolean,
  },
  data: () => ({}),
  computed: {
    bkPoint() {
      const bkPt = this.$vuetify.breakpoint
      const point = {
        dialogHeight: 9 * 60,
        dialogWidth: 16 * 60,
      }
      switch (bkPt.name) {
        case 'md':
          point.dialogHeight = 9 * 50
          point.dialogWidth = 16 * 50
          break
        case 'sm':
          point.dialogHeight = 9 * 40
          point.dialogWidth = 16 * 40
          break
        case 'xs':
          point.dialogHeight = 9 * 20
          point.dialogWidth = 16 * 20
          break
        default:
          break
      }
      return point
    },
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>
