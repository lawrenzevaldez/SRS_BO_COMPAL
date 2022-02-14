import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment'
import store from './store'
import accounting from 'accounting'
import LoadScript from 'vue-plugin-load-script';
import VueSession from 'vue-session'
import VModal from 'vue-js-modal'

let apiUrl = 'http://192.168.115.100:1112/api/'
global.apiUrl = apiUrl

Vue.config.productionTip = false
Vue.use(LoadScript)
Vue.use(VueSession)
Vue.use(VModal)
Vue.filter('date', function(value) {
  return moment(value).format('YYYY-MM-DD')
})

Vue.filter('money', function(money) {
  return accounting.formatNumber(money, 3, ",")
})

new Vue({
  router,
  store,
  LoadScript,
  VueSession,
  render: h => h(App),
}).$mount('#app')
