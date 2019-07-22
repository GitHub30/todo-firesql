export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  },
  STORE_STATE(state, newState) {
    this.replaceState(newState)
  }
}
