import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueWorker from 'vue-worker';

Vue.use(VueWorker)
Vue.config.productionTip = false
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
