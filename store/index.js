import { vuexfiresqlActions, vuexfiresqlMutations } from 'vuexfiresql'

export const mutations = {
  increment(state) {
    state.counter++
  },
  ...vuexfiresqlMutations
}

export const actions = {
  ...vuexfiresqlActions
}
