import sortBy from 'lodash/sortBy'
import isUndefined from 'lodash/isUndefined'

export default {
  state: {
    activeTask: null,
    tasks: []
  },
  getters: {
    activeTask: state => { return state.activeTask },
    tasks: state => { return state.tasks }
  },
  mutations: {
    createList (state, date) {
      const task = {
        body: '',
        completion: false,
        date: date
      }

      state.tasks.push(task)
      state.tasks = sortBy(state.tasks, ['date'])
      state.activeTask = task
    },
    createTask (state, { atIndex, body = '' }) {
      const index = state.tasks.indexOf(state.activeTask)
      const newTask = {
        body: body,
        completion: false,
        date: state.activeTask.date
      }

      state.tasks.splice(index + atIndex, 0, newTask)
      state.activeTask = state.tasks[state.tasks.indexOf(newTask)]
    },
    updateTaskCompletion ({ activeTask }, completion) {
      activeTask.completion = completion
    },
    updateTaskBody ({ activeTask }, body) {
      activeTask.body = body
    },
    removeTask (state) {
      const index = state.tasks.indexOf(state.activeTask)
      const task = state.tasks[index - 1]

      state.tasks.splice(index, 1)
      if (!isUndefined(task)) { state.activeTask = task }
    },
    selectTask (state, task) {
      state.activeTask = task
    },
    selectPreviousTask (state) {
      const index = state.tasks.indexOf(state.activeTask)
      const task = state.tasks[index - 1]

      if (!isUndefined(task)) { state.activeTask = task }
    },
    selectNextTask (state) {
      const index = state.tasks.indexOf(state.activeTask)
      const task = state.tasks[index + 1]

      if (!isUndefined(task)) { state.activeTask = task }
    },
    joinToPreviousTask (state) {
      const index = state.tasks.indexOf(state.activeTask)
      const previousTask = state.tasks[index - 1]

      if (!isUndefined(previousTask)) {
        previousTask.body = previousTask.body.concat(state.activeTask.body)
      }
    }
  },
  actions: {
    joinTask ({ commit }) {
      commit('joinToPreviousTask')
      commit('removeTask')
    },
    updateTask ({ commit, dispatch }, { body, completion }) {
      if (!isUndefined(body)) {
        commit('updateTaskBody', body)
      }

      if (!isUndefined(completion)) {
        commit('updateTaskCompletion', completion)
      }

      dispatch('saveActiveList')
    }
  }
}
