<template>
  <div>
    <span v-if="isLogined">
      <v-btn color="blue-grey" class="white--text" to="/account">
        <v-icon> mdi-account </v-icon>
      </v-btn>
    </span>
    <span v-else>
      <v-btn color="blue-grey" class="white--text" to="/account/login">
        <v-icon :left="showText"> mdi-login </v-icon>
        <span v-show="showText"> Login </span>
      </v-btn>
    </span>
  </div>
</template>

<script>
export default {
  name: 'HeaderAccount',
  data: () => ({
    isLogined: false,
  }),
  computed: {
    showText() {
      const bkPt = this.$vuetify.breakpoint
      let showText = true
      switch (bkPt.name) {
        case 'xs':
          showText = false
          break
        default:
          break
      }
      return showText
    },
  },
  mounted() {
    this.$store.commit('auth/setSession', this.$cookies.get('session'))
    this.isLogined = this.$store.getters['auth/isLogined']
  },
  methods: {},
}
</script>
