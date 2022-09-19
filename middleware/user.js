export default async function ({ store, app }) {
  store.commit('auth/setSession', app.$cookies.get('jwt'))
  store.commit('user/setToken', app.$cookies.get('jwt'))
  const isLogined = store.getters['auth/isLogined']
  const isExistUser = store.getters['user/isExistUser']
  if (isLogined) {
    if (!isExistUser) {
      await store.dispatch('user/getUser')
      await store.dispatch('user/getTwitchUser')
    }
    const isFollows = store.getters['user/isFollows']
    if (!isFollows) {
      await store.dispatch('user/getFollows')
    }
  }
}
