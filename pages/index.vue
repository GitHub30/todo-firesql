/* eslint-disable no-console */
<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        v-model="newTodo"
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      ><!-- eslint-disable-line prettier/prettier -->
    </header>
    <section v-show="$store.state.todos.list.length" v-cloak class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
      ><!-- eslint-disable-line prettier/prettier -->
      <label for="toggle-all" />
      <ul class="todo-list">
        <li
          v-for="(todo, index) in $store.state.todos.list"
          :key="index"
          class="todo"
          :class="{ completed: todo.done, editing: todo == editedTodo }"
        >
          <div class="view">
            <input :checked="todo.done" class="toggle" type="checkbox" @click="toggle(todo)"><!-- eslint-disable-line prettier/prettier -->
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="removeTodo(todo)" />
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      newTodo: '',
      visibility: 'all'
    }
  },
  methods: {
    addTodo() {
      this.$store.commit('todos/add', this.newTodo)
      this.newTodo = ''
    },
    ...mapMutations({
      toggle: 'todos/toggle',
      removeTodo: 'todos/remove'
    }),
    removeCompleted() {},
    editedTodo() {}
  },
  // eslint-disable-next-line vue/order-in-components
  mounted() {
    this.$db.socket.on('connect', async () => {
      await this.$db.query(
        'CREATE TABLE IF NOT EXISTS json (id int NOT NULL, json JSON, PRIMARY KEY(id))'
      )
      this.$store.dispatch('SYNC_STATE', {
        table: 'json',
        pkColumnName: 'id',
        pk: 101,
        jsonColumnName: 'json'
      })
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
.todoapp h1 {
  margin-top: 32px;
}
[v-cloak] {
  display: none;
}
</style>
