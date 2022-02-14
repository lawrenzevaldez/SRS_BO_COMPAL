//load store to main.js

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        branch_name: '',
        message: '',
        count: 0
    },
    mutations: { //synchronus
        increment(state, payload) {
            state.count += payload
        },
        async branch_name(state, payload) {
            state.branch_name = await payload
        }
    },
    actions: { //async chronus
        increment(state, payload) {
            state.commit('increment', payload)
        }
    },
    getters: {
        message(state) {
            return state.message.toUpperCase()
        },
        branch_name(state) {
            return state.branch_name.toUpperCase()
        },
        counter(state) {
            return state.count
        }
    }
})