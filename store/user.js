import axios from 'axios'
import Vue from 'vue'

export const state = () => ({
  name: null,
  displayName: null,
  id: null,
  token: null,
  email: null,
  isStaff: null,
  isSuperuser: null,
  profileImage: null,
  follows: [],
})

export const getters = {
  isExistUser(state) {
    return !!state.id
  },
  isFollows(state) {
    return state.follows.length !== 0
  },
}

export const mutations = {
  init(state) {
    state.name = null
    state.displayName = null
    state.id = null
    state.token = null
    state.email = null
    state.lastLogin = null
    state.isStaff = null
    state.isSuperuser = null
    state.profileImage = null
    state.follows = []
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
  setToken(state, token) {
    state.token = token
  },
  setEmail(state, email) {
    state.email = email
  },
  setLastLogin(state, lastLogin) {
    state.lastLogin = lastLogin
  },
  setIsStaff(state, isStaff) {
    state.isStaff = isStaff
  },
  setIsSuperuser(state, isSuperuser) {
    state.isSuperuser = isSuperuser
  },
  setProfileImage(state, profileImage) {
    state.profileImage = profileImage
  },
  setFollows(state, follows) {
    state.follows = follows
  },
  alterFavorite(state, index) {
    const follow = state.follows[index]
    follow.isFavorite = !follow.isFavorite
    Vue.set(state.follows, index, follow)
  },
}

export const actions = {
  async getUser({ state, commit }) {
    try {
      const response = await axios.get(`${this.$config.apiURL}/api/user`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
      const data = response.data
      commit('setLastLogin', data.lastLogin)
      commit('setIsStaff', data.isStaff)
      commit('setIsSuperuser', data.isSuperuser)
    } catch (error) {
      console.log(error)
    }
  },
  async getTwitchUser({ commit }) {
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
      let after = ''
      do {
        if (after === '') {
          const responseFollows = await this.$twitch.app.getFollows(state.id)
          after = responseFollows.data.response.pagination.cursor
          follows = responseFollows.data.response.data
        } else {
          const responseFollows = await this.$twitch.app.getAfterFollows(
            state.id,
            after
          )
          after = responseFollows.data.response.pagination.cursor
          follows = follows.concat(responseFollows.data.response.data)
        }
      } while (after)
      const followIDs = follows.map((value) => value.to_id)
      let users = []
      while (followIDs.length) {
        const part = followIDs.splice(0, 100)
        const responseUsers = await this.$twitch.app.getUsers(part)
        users = users.concat(responseUsers.data.response.data)
      }
      follows.forEach((follow) => {
        follow.to = `/app/${follow.to_login}`
        follow.isFavorite = false
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
