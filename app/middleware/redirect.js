export default function ({ redirect, store, route }) {
  if(!store.$auth.loggedIn && route.fullPath !== '/') {
    return redirect('/');
  }
}