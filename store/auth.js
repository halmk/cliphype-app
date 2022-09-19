export const state = () => ({
  session: null,
})

export const getters = {
  isLogined(state) {
    return !!state.session
  },
}

export const mutations = {
  setSession(state, session) {
    state.session = session
  },
}
