import Vue from 'vue'
import { BootstrapVue} from 'bootstrap-vue'
import App from './App.vue'
import VueAnalytics from 'vue-analytics'
import VueRouter from 'vue-router'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { routes } from './routes.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.component('VueSlider', VueSlider);

const router = new VueRouter({
  routes
});


Vue.use(VueAnalytics,{
  id: 'UA-162965540-1',
  router,
  debug: {
    enabled: true
  } 
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
