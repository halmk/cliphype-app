<template>
  <div>
    <v-row>
      <v-col cols="12" sm="2" lg="1">
        <v-img :src="profileImage" max-height="300" max-width="300"> </v-img>
      </v-col>
      <v-col cols="12" sm="10">
        <h3>Email: {{ email }}</h3>
        <h3>
          Login:
          <a :href="channelURL">
            {{ username }}
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
import { mapState } from 'vuex'
export default {
  name: 'AccountInfo',
  data: () => ({
    loading: false,
    error: false,
  }),
  computed: {
    ...mapState({
      username: (state) => state.user.name,
      email: (state) => state.user.email,
      profileImage: (state) => state.user.profileImage,
    }),
    channelURL() {
      return `https://twitch.tv/${this.username}`
    },
  },
}
</script>
