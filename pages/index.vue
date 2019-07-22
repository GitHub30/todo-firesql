/* eslint-disable no-console */
<template>
  <div class="container">
    <div>
      <ul>
        <li v-for="(todo, index) in $store.state.todos.list" :key="index">
          <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
          <!-- eslint-disable-next-line prettier/prettier -->
          <input type="checkbox" :checked="todo.done" @change="toggle(todo)">
          <span :class="{ done: todo.done }">{{ todo.text }}</span>
        </li>
        <li>
          <form @submit.prevent="addTodo">
            <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
            <!-- eslint-disable-next-line vue/html-self-closing -->
            <input v-model="newTodo" placeholder="What needs to be done?" />
          </form>
        </li>
      </ul>
      <logo />
      <h1 class="title">
        todo-firesql
      </h1>
      <h2 class="subtitle">
        My luminous Nuxt.js project
      </h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      newTodo: ''
    }
  },
  methods: {
    addTodo() {
      this.$store.commit('todos/add', this.newTodo)
      this.newTodo = ''
    },
    ...mapMutations({
      toggle: 'todos/toggle'
    })
  },
  // eslint-disable-next-line vue/order-in-components
  created() {
    this.$store.dispatch('SYNC_STATE', {
      table: 'json',
      pkColumnName: 'id',
      pk: 101,
      jsonColumnName: 'json'
    })
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
