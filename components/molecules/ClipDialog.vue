<template>
  <v-dialog
    :value="showDialog"
    :width="bkPoint.dialogWidth"
    :fullscreen="bkPoint.fullscreen"
    transition="dialog-bottom-transition"
    @click:outside.stop="close"
  >
    <v-card>
      <v-toolbar dark dense color="grey darken-4">
        <v-btn icon dark @click.stop="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-sheet :height="bkPoint.dialogHeight" width="100%">
        <iframe
          :src="embedClipURL"
          height="100%"
          width="100%"
          frameborder="0"
          allowfullscreen
        >
        </iframe>
      </v-sheet>
      <div style="overflow-x: hidden">
        <slot></slot>
      </div>
    </v-card>
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
        fullscreen: false,
      }
      switch (bkPt.name) {
        case 'md':
          point.dialogWidth = 16 * 50
          point.dialogHeight = 9 * 50
          break
        case 'sm':
          point.dialogWidth = 16 * 40
          point.dialogHeight = 9 * 40
          break
        case 'xs':
          point.dialogWidth = bkPt.width
          point.dialogHeight = (bkPt.width * 9) / 16
          point.fullscreen = true
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
