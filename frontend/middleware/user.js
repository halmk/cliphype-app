export default async function ({ store, app }) {
  store.commit('auth/setSession', app.$cookies.get('jwt'))
  const isLogined = store.getters['auth/isLogined']
  const isExistUser = store.getters['user/isExistUser']
  if (isLogined) {
    if (!isExistUser) {
      await store.dispatch('user/getUser')
    }
    const isFollows = store.getters['user/isFollows']
    if (!isFollows) {
      await store.dispatch('user/getFollows')
    }
  }
}
