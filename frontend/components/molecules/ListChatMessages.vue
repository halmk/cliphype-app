<template>
  <div>
    <v-virtual-scroll
      ref="vscroller"
      :items="messages"
      height="300"
      item-height="30"
    >
      <template #default="{ index, item }">
        <v-list-item :key="index" dense>
          <v-list-item-content>
            <v-list-item-title>
              <span :style="{ color: item.color }">{{ item.displayName }}</span>
              <span>: {{ item.message }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    streamer: String,
  },
  data: () => ({
    messages: [],
  }),
  computed: {},
  async mounted() {
    await this.getChatbot()
    const opts = this.$chatbot.getOpts()
    this.$chatbot.newClient(opts)
    this.$chatbot.onEvent('message', this.onMessageHandler)
    this.$chatbot.onEvent('connected', this.onConnectedHandler)
    this.$chatbot.connect()
  },
  methods: {
    async getChatbot() {
      try {
        const response = await axios.get(`${this.$config.apiURL}/api/chatbot`)
        console.log(response)
        const username = response.data.username
        const password = response.data.password
        this.$chatbot.initOpts(username, password, this.streamer)
      } catch (error) {
        console.log(error)
      }
    },
    // Called every time a message comes in
    onMessageHandler(target, context, msg, self) {
      if (self) {
        return
      } // Ignore messages from the bot

      // Remove whitespace from chat message
      const message = msg.trim()
      const displayName = context['display-name']
      const color = context.color
      this.messages.push({
        message,
        displayName,
        color,
      })
      this.scrollDown()
    },

    // Called every time the bot connects to Twitch chat
    onConnectedHandler(addr, port) {
      console.log(`* Connected to ${addr}:${port}`)
    },

    scrollDown() {
      try {
        const el = this.$refs.vscroller.$el
        el.scrollTop = this.messages.length * 30
      } catch (error) {}
    },
  },
}
</script>
