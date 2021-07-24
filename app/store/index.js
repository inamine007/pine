export const state = () => ({
  csrfToken: '',
});

export const mutations = {
  SET_CSRF_TOKEN (state, csrfToken) {
    state.csrfToken = csrfToken
  },
}

export const actions = {
  nuxtServerInit ({commit}, { req }) {
    console.log(req);
    if (req.cookies) {
      commit('SET_CSRF_TOKEN', req.csrfToken())
    }
  },
}