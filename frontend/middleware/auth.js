export default function ({ redirect, store, route, app }) {
  store.commit('auth/setSession', app.$cookies.get('session'))
  const isLogined = store.getters['auth/isLogined']

  if (!isLogined && route.path !== '/account/login') {
    redirect('/account/login')
  }
  if (isLogined && route.path === '/account/login') {
    redirect('/')
  }
}
