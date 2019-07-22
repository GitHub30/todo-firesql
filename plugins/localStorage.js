import { FireSQL } from 'firesql.js'

export default ({ store }) => {
  const firesql = new FireSQL('http://localhost:8080')
  window.f = firesql
  const STORE_STATE = 'STORE_STATE'
  let updateState
  let event

  window.syncState = ({ table, pkColumnName, pk, jsonColumnName }) => {
    let ownEvent = false
    if (event) firesql.socket.off(event)
    event = table + '/' + pk
    firesql.on(event, (row, type) => {
      if (ownEvent) {
        ownEvent = false
        return
      }
      // eslint-disable-next-line no-console
      console.log('precommit', row, type)
      if (type === 'UpdateRowsEvent') {
        store.commit('STORE_STATE', row.after_values[jsonColumnName])
      }
    })
    firesql
      .table(table)
      .where(pkColumnName, pk)
      .select(jsonColumnName)
      .then((rows) => {
        // eslint-disable-next-line no-console
        console.log(rows)
        if (rows) {
          store.commit(STORE_STATE, JSON.parse(rows[0][jsonColumnName]))
        } else {
          firesql.table(table).insert({
            [pkColumnName]: pk,
            [jsonColumnName]: JSON.stringify(store.state)
          })
        }
      })
    updateState = (state) => {
      firesql
        .table(table)
        .where(pkColumnName, pk)
        .update({ [jsonColumnName]: JSON.stringify(state) })
      ownEvent = true
    }
  }

  store.subscribe((mutation, state) => {
    if (mutation.type === STORE_STATE) return
    if (updateState) updateState(state)
  })
}
