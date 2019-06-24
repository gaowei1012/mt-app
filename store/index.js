import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'

Vue.use(Vuex)

const state = () => new Vuex.Store({
  modules: {
    geo
  },
  actions: {
    // nuxt server init
    async nuxtServerInit({
      commit
    }, {req, app}) {
      const {status, data: {city, province}} = app.$axios.get('/geo/getPosition')
      commit('geo/setPosition', status ===200 ? {city, province} : {city: '', province: ''})
    }
  }
})


export default state