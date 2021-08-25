import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from "@/filters/date.filter";
import 'materialize-css/dist/js/materialize.min'

import Vuelidate from 'vuelidate';
import messagePlugin from './utils/message.plugin'

Vue.config.productionTip = false
Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
