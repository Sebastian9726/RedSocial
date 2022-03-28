import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from 'axios';
import VueAxios from 'vue-axios';


import FormAlert from "./components/Shared/FormAlert";

// Volver componente global
Vue.component("form-alert", FormAlert);

Vue.use(VueAxios, axios);

// Configuracion para el cliente Apollo,se exporta para usarlo en store.js


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    // ejecuta el request getCurrentUser cuando la aplicación es creada
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
