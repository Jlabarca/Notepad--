import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
/* eslint-disable */

require(['emmet/emmet'], data => {
  // this is huge. so require it async is better
  window.emmet = data.emmet;
});

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
