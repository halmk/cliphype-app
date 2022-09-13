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
              <span> ({{ item.hype }})</span>
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
  name: 'ListChatMessages',
  props: {
    streamer: String,
  },
  data: () => ({
    messages: [],
  }),
  computed: {},
  mounted() {
    try {
      this.$chatbot.initOpts('', '', this.streamer)
      const opts = this.$chatbot.getAnonymousOpts()
      this.$chatbot.newClient(opts)
      this.$chatbot.onEvent('message', this.onMessageHandler)
      this.$chatbot.onEvent('connected', this.onConnectedHandler)
      this.$chatbot.connect()
    } catch (error) {
      this.messages.push({
        message: 'Failed to connect to the chat',
        displayName: '[BOT]',
        color: '#F44336',
      })
    }
  },
  destroyed() {
    this.$chatbot.disconnect()
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
    async getHypes(message) {
      try {
        const params = { sentence: message }
        const response = await axios.get(`${this.$config.apiURL}/api/hypes`, {
          params,
        })
        return response
      } catch (error) {
        console.log(error)
      }
    },
    async setHypes(index, message) {
      const response = await this.getHypes(message)
      const hypes = response.data.hypes
      const maxHype = hypes.reduce((hype, obj) => {
        return Math.max(hype, obj.value)
      }, 0.1)
      console.log(maxHype)
      message = this.messages[index]
      message.hype = maxHype.toFixed(2)
      this.$set(this.messages, index, message)
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
      const index = this.messages.length
      this.messages.push({
        message,
        displayName,
        color,
      })
      this.setHypes(index, message)
      this.scrollDown()
    },

    // Called every time the bot connects to Twitch chat
    onConnectedHandler(addr, port) {
      this.messages.push({
        message: 'Connected to the chat',
        displayName: '[BOT]',
        color: '#E0E0E0',
      })
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
