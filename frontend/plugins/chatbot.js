import tmi from 'tmi.js'

const ChatBot = {
  client: null,
  username: '',
  password: '',
  channel: '',
  messages: [],

  // Define configuration options
  getOpts() {
    return {
      identity: {
        username: ChatBot.username,
        password: ChatBot.password,
      },
      channels: [ChatBot.channel],
    }
  },

  getAnonymousOpts() {
    return {
      channels: [ChatBot.channel],
    }
  },

  getMessages() {
    return ChatBot.messages
  },

  initOpts(username, password, channel) {
    ChatBot.username = username
    ChatBot.password = password
    ChatBot.channel = channel
  },

  newClient(opts) {
    ChatBot.client = new tmi.Client(opts)
  },

  onEvent(event, func) {
    ChatBot.client.on(event, func)
  },

  pushMessage(message) {
    ChatBot.messages.push(message)
  },

  connect() {
    // Connect to Twitch:
    ChatBot.client.connect()
  },

  disconnect() {
    // Disconnect from Twitch:
    ChatBot.client.disconnect()
    console.log('* Disconnected from IRC')
  },
}

export default ({ app }, inject) => {
  inject('chatbot', ChatBot)
}
