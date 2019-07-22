import io from 'socket.io-client'

class FireSQL {
  constructor(url) {
    // eslint-disable-next-line no-console
    console.log('initialize')
    this.socket = io(url)
  }

  on(table, callback) {
    this.socket.emit('_enter_room', table)
    this.socket.on(table, callback)
  }

  query(sql) {
    // eslint-disable-next-line no-console
    console.log(sql)
    this._clearSQL()
    // eslint-disable-next-line prettier/prettier
    return new Promise(resolve => this.socket.emit('_query', sql, resolve))
  }

  _clearSQL() {
    this.tableName = ''
    this.whereString = ''
  }

  table(tableName) {
    this.tableName = tableName
    return this
  }

  where(...args) {
    if (args.length === 2) args = [args[0], '=', args[1]]
    const condition = `${args[0]}${args[1]}${this._escape(args[2])}`
    if (this.whereString) {
      this.whereString += ` AND ${condition}`
    } else {
      this.whereString = ` WHERE ${condition}`
    }
    return this
  }

  select(...columns) {
    const columnsString = columns.length ? columns.join(', ') : '*'
    const sql = `SELECT ${columnsString} FROM ${this.tableName}${this.whereString}`
    // eslint-disable-next-line prettier/prettier
    return new Promise(resolve => this.query(sql).then(resolve))
  }

  insert(...valuesArray) {
    const columnsString = Object.keys(valuesArray[0]).join(', ')
    const valuesArrayString = valuesArray
      // eslint-disable-next-line prettier/prettier
      .map(values => `(${Object.values(values).map(this._escape).join(', ')})`)
      .join(', ')
    const sql = `INSERT INTO ${this.tableName} (${columnsString}) VALUES ${valuesArrayString}`
    // eslint-disable-next-line prettier/prettier
    return new Promise(resolve => this.query(sql).then(resolve))
  }

  update(values) {
    const valuesString = Object.entries(values)
      .map(([column, value]) => `${column}=${this._escape(value)}`)
      .join(', ')
    const sql = `UPDATE ${this.tableName} SET ${valuesString}${this.whereString}`
    // eslint-disable-next-line prettier/prettier
    return new Promise(resolve => this.query(sql).then(resolve))
  }

  delete() {
    const sql = `DELETE FROM ${this.tableName}${this.whereString}`
    // eslint-disable-next-line prettier/prettier
    return new Promise(resolve => this.query(sql).then(resolve))
  }

  _escape(data) {
    switch (typeof data) {
      case 'string':
        return `'${data.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`
      default:
        return data
    }
  }
}

export default ({ store }) => {
  const firesql = new FireSQL('http://localhost:8080')
  window.f = firesql
  const STORE_STATE = 'STORE_STATE'
  let updateState
  let event

  window.syncState = ({ table, pkColumnName, pk, jsonColumnName }) => {
    let ownEvent = false
    firesql.socket.off(event)
    if (event) event = table + '/' + pk
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
