import { vuexFireSQL } from 'vuexfiresql'

export default ({ store }, inject) => {
  const db = vuexFireSQL('http://localhost:8080')(store)
  inject('db', db)
}
