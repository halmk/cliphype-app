export const state = () => ({
  name: null,
  displayName: null,
  id: null,
  email: null,
  profileImage: null,
  follows: null,
})

export const getters = {
  isExistUser(state) {
    return !!state.id
  },
  isFollows(state) {
    return !!state.follows
  },
}

export const mutations = {
  init(state) {
    state.name = null
    state.displayName = null
    state.id = null
    state.email = null
    state.profileImage = null
    state.follows = null
  },
  setName(state, name) {
    state.name = name
  },
  setDisplayName(state, displayName) {
    state.displayName = displayName
  },
  setID(state, id) {
    state.id = id
  },
  setEmail(state, email) {
    state.email = email
  },
  setProfileImage(state, profileImage) {
    state.profileImage = profileImage
  },
  setFollows(state, follows) {
    state.follows = follows
  },
}

export const actions = {
  async getUser({ commit }) {
    this.$twitch.apiURL = `${this.$config.apiURL}/api/twitch`
    this.$twitch.user.token = this.$cookies.get('jwt')
    try {
      const response = await this.$twitch.user.getUser()
      const data = response.data.response
      commit('setName', data.login)
      commit('setDisplayName', data.display_name)
      commit('setID', data.id)
      commit('setEmail', data.email)
      commit('setProfileImage', data.profile_image_url)
    } catch (error) {
      console.log(error)
    }
  },

  async getFollows({ state, commit }) {
    this.$twitch.apiURL = `${this.$config.apiURL}/api/twitch`
    this.$twitch.user.token = this.$cookies.get('jwt')
    let follows = []
    try {
      const responseFollows = await this.$twitch.app.getFollows(state.id)
      follows = responseFollows.data.response.data
      const followIDs = follows.map((value) => value.to_id)
      const responseUsers = await this.$twitch.app.getUsers(followIDs)
      const users = responseUsers.data.response.data
      follows.forEach((follow) => {
        follow.to = `/app/${follow.to_login}`
        const user = users.filter((user) => user.id === follow.to_id)
        if (user.length === 1) {
          follow.icon = user[0].profile_image_url
        }
      })
      commit('setFollows', follows)
    } catch (error) {
      console.log(error)
    }
  },
}
