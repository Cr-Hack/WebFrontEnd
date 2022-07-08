import { createStore } from 'vuex'

export default createStore({
    state: {
        token: "",
        user: {},
        authentificated: false
    },
    getters: {
        token: (state) => state.token,
        user: (state) => state.user,
        authentificated: (state) => state.authentificated
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
        },
        SET_USER(state, user) {
            state.user = user
        },
        SET_AUTHENTIFICATED(state, authentificated) {
            state.authentificated = authentificated
        },
    },
    actions: {
        setToken(context, token) {
            context.commit("SET_TOKEN", token)
        },
        addUser(context, user) {
            context.commit("SET_USER", user)
            context.commit("SET_AUTHENTIFICATED", true)
        },
        logOut(context) {
            context.commit("SET_USER", null)
            context.commit("SET_AUTHENTIFICATED", false)
        }
    },
    modules: {}
})