import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import dateFilter from "@/filters/date.filter";

import Vuelidate from 'vuelidate';
import 'materialize-css/dist/js/materialize.min'
import messagePlugin from './utils/message.plugin'

import {initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false
Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter('date', dateFilter)


const firebaseConfig = {
  databaseURL: "https://vuecrm-44e9b-default-rtdb.europe-west1.firebasedatabase.app/",
  apiKey: "AIzaSyBEOIK1nLPKQ46PirR0h5fK3IzN_zIzlq0",
  authDomain: "vuecrm-44e9b.firebaseapp.com",
  projectId: "vuecrm-44e9b",
  storageBucket: "vuecrm-44e9b.appspot.com",
  messagingSenderId: "1088703832006",
  appId: "1:1088703832006:web:4c6e8bfb978ac233c2dcc7"
};


let appVue;
getAuth(initializeApp(firebaseConfig)).onAuthStateChanged(() => {
  // Check for user status

  if (!appVue) {
    appVue = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
});

