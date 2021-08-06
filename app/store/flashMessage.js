export const state = () => ({
  text: '',
});

export const mutations = {
  setMessage: (state, payload) => {
    state.text = payload.text; // stateの状態を変更する
  }
}

export const actions = {
  async showFlashMessage({commit}, message) {
    commit('setMessage', message); //mutationに値を渡す
  }
}