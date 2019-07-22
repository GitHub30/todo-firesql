import { vuexFireSQL } from 'vuexfiresql'

function getURL(key, _default) {
  const url = new URL(document.location).searchParams.get(key)
  return url || _default
}

export default ({ store }, inject) => {
  const db = vuexFireSQL(getURL('url', 'http://localhost:8080'))(store)
  inject('db', db)
}
