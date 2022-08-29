<template>
  <div>
    <v-row>
      <v-col cols="12" sm="2" lg="1">
        <v-img :src="user.profile_image_url" max-height="300" max-width="300">
        </v-img>
      </v-col>
      <v-col cols="12" sm="10">
        <h3>Email: {{ user.email }}</h3>
        <h3>
          Login:
          <a :href="channelURL">
            {{ user.login }}
          </a>
        </h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="orange lighten-2" to="/account/logout"> Logout </v-btn>
        <v-btn
          color="purple lighten-3"
          href="https://www.twitch.tv/settings/connections"
        >
          <v-icon left>mdi-twitch</v-icon>
          Disconnect
          <v-icon right>mdi-open-in-new</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'AccountInfo',
  data: () => ({
    user: {},
    loading: false,
    error: false,
  }),
  computed: {
    channelURL() {
      return `https://twitch.tv/${this.user.login}`
    },
  },
  async mounted() {
    this.$twitch.apiURL = `${this.$config.apiURL}/api/twitch`
    this.$twitch.user.token = this.$cookies.get('jwt')
    await this.GetUserInfo()
  },
  methods: {
    async GetUserInfo() {
      try {
        const response = await this.$twitch.user.getUser()
        console.log(response)
        const data = response.data.response
        this.user = data
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
