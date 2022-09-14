<template>
  <div>
    <v-virtual-scroll
      ref="vscroller"
      :items="messages"
      height="450"
      item-height="30"
    >
      <template #default="{ index, item }">
        <v-list-item :key="index" dense>
          <v-list-item-content>
            <v-list-item-title>
              <span :style="{ color: item.color }">{{ item.displayName }}</span>
              <span>: {{ item.message }}</span>
              <span> ({{ item.hype }})</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
export default {
  name: 'ListChatMessages',
  props: {
    messages: Array,
  },
  updated() {
    this.scrollDown()
  },
  methods: {
    scrollDown() {
      try {
        const el = this.$refs.vscroller.$el
        el.scrollTop = this.messages.length * 30
      } catch (error) {}
    },
  },
}
</script>
