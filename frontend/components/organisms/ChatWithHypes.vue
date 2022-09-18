<template>
  <div>
    <v-row class="flex">
      <v-col cols="12" lg="6">
        <div class="ma-1 elevation-5">
          <ListChatMessages :messages="messages" />
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <h2 class="pl-1">Hype Chart</h2>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <div v-bind="attrs" style="width: min-content" v-on="on">
              <v-switch
                v-model="enableAutoClip"
                class="pl-1"
                style="width: 200px"
                :disabled="disableAutoClipSwitch"
                dense
                label="Turn on AutoClip"
              ></v-switch>
            </div>
          </template>
          <span>Only specific users are allowed: streamer, staff</span>
        </v-tooltip>
        <line-chart
          class="mb-2 elevation-5"
          :chart-options="chartOptions"
          :chart-data="chartData"
          chart-id="myCustomId"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import 'chartjs-adapter-moment'
import 'chartjs-plugin-streaming'

export default {
  name: 'ChatWithHypes',
  props: {
    streamer: String,
  },
  data: () => ({
    streamerID: '',
    serialID: 0,
    messages: [],
    messagesInterval: 3 * 60 * 1000,
    chartOptions: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            duration: 3 * 60 * 1000,
            delay: 0,
          },
        },
      },
    },
    chartData: {
      labels: [],
      datasets: [
        {
          label: 'hype',
          data: [],
          fill: false,
          pointBorderWidth: 0,
          pointRadius: 0,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'outlier',
          data: [],
          fill: false,
          pointBorderWidth: [],
          pointRadius: [],
          borderDash: [5, 5],
          borderColor: 'rgb(175, 102, 102)',
          tension: 0.1,
        },
        {
          label: 'outlier (weak)',
          data: [],
          fill: false,
          pointBorderWidth: [],
          pointRadius: [],
          borderDash: [5, 5],
          borderColor: 'rgb(102, 175, 102)',
          tension: 0.1,
        },
      ],
    },
    recentHypes: [],
    recentHypesInterval: 10 * 1000,
    totalHypes: [],
    totalHypesInterval: 60 * 60 * 1000,
    enableAutoClip: false,
    lastCreateClipTime: 0,
    autoClipCoolTime: 30 * 1000,
    autoClipDelay: 15 * 1000,
  }),
  computed: {
    disableAutoClipSwitch() {
      return (
        this.streamer !== this.$store.state.user.name &&
        !this.$store.state.user.isStaff
      )
    },
  },
  async mounted() {
    this.$twitch.apiURL = `${this.$config.apiURL}/api/twitch`
    this.$twitch.user.token = this.$cookies.get('jwt')
    try {
      await this.getStreamerId()
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
    async getStreamerId() {
      try {
        const response = await this.$twitch.app.getUserId(this.streamer)
        const data = response.data.response.data
        this.streamerID = data[0].id
      } catch (error) {
        console.log(error)
      }
    },
    async getChatbot() {
      try {
        const response = await axios.get(`${this.$config.apiURL}/api/chatbot`)
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
    async setHypes(id, message) {
      const current = Date.now()
      const response = await this.getHypes(message)
      const hypes = response.data.hypes
      const maxHype = hypes.reduce((hype, obj) => {
        return Math.max(hype, obj.value)
      }, 0.1)
      const index = this.messages.findIndex((obj) => obj.id === id)
      message = this.messages[index]
      message.hype = maxHype.toFixed(2)
      this.$set(this.messages, index, message)

      // calculate hype stats
      const { totalHype, outlier, outlierWeak } = this.calcHypeStats(
        current,
        maxHype
      )
      this.chartData.labels.push(current)
      this.chartData.datasets[0].data.push(totalHype)
      this.chartData.datasets[1].data.push(outlier)
      this.chartData.datasets[1].pointBorderWidth.push(0)
      this.chartData.datasets[1].pointRadius.push(0)
      this.chartData.datasets[2].data.push(outlierWeak)

      // determine if the create clip condition is satisfied
      if (this.canCreateClip() && totalHype >= outlierWeak) {
        this.chartData.datasets[2].pointBorderWidth.push(8)
        this.chartData.datasets[2].pointRadius.push(3)
        const exceededAt = Date.now()
        this.lastCreateClipTime = exceededAt
        // send create clip request after the specified delay
        await new Promise((resolve) =>
          setTimeout(async () => {
            try {
              await this.$twitch.user.createClip(this.streamerID)
            } catch (error) {
              console.log(error)
            }
            resolve()
          }, this.autoClipDelay)
        )
      } else {
        this.chartData.datasets[2].pointBorderWidth.push(0)
        this.chartData.datasets[2].pointRadius.push(0)
      }
    },
    calcHypeStats(current, hype) {
      this.recentHypes.push({ value: hype, unixTime: current })
      this.recentHypes = this.recentHypes.filter((obj) => {
        const diff = current - obj.unixTime
        return diff <= this.recentHypesInterval
      })
      const totalHype = this.recentHypes.reduce(
        (prev, obj) => prev + obj.value,
        0
      )
      const quartile = this.calcQuartile(
        this.totalHypes.map((obj) => obj.value)
      )
      this.totalHypes.push({ value: totalHype, unixTime: current })
      this.totalHypes = this.totalHypes.filter((obj) => {
        const diff = current - obj.unixTime
        return diff <= this.totalHypesInterval
      })
      const outlier = quartile[2] + 1.5 * (quartile[2] - quartile[0])
      const outlierWeak = quartile[2] + 0.5 * (quartile[2] - quartile[0])
      return { totalHype, outlier, outlierWeak }
    },
    calcQuartile(array) {
      array.sort((a, b) => a - b)
      const q = [0, 0, 0]
      const m = array.length
      let halfArrays
      if (m % 2 === 0) {
        halfArrays = [array.slice(0, m / 2), array.slice(m / 2, m)]
      } else {
        halfArrays = [array.slice(0, m / 2), array.slice(m / 2 + 1, m)]
      }
      q[0] = this.calcMid(halfArrays[0])
      q[1] = this.calcMid(array)
      q[2] = this.calcMid(halfArrays[1])

      return q
    },
    calcMid(array) {
      array.sort((a, b) => a - b)
      const n = array.length
      const m = parseInt(n / 2)
      let res
      if (n % 2 === 0) {
        res = (array[m] + array[m - 1]) / 2.0
      } else {
        res = array[m]
      }
      return res
    },
    canCreateClip() {
      const diff = Date.now() - this.lastCreateClipTime
      if (!this.enableAutoClip) return false
      if (diff < this.autoClipCoolTime) return false
      return true
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
      const current = Date.now()
      const id = ++this.serialID
      this.messages.push({
        id,
        message,
        displayName,
        color,
        unixTime: current,
        hype: 0.0,
      })
      this.setHypes(id, message)
      this.messages = this.messages.filter((obj) => {
        const diff = current - obj.unixTime
        return diff <= this.messagesInterval
      })
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
  },
}
</script>
