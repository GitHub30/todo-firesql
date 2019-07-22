import { vuexfiresqlActions, vuexfiresqlMutations } from '../plugins/index'

export const mutations = {
  increment(state) {
    state.counter++
  },
  ...vuexfiresqlMutations
}

export const actions = {
  ...vuexfiresqlActions
}
