import Loader from './components/Loader.vue'
import Home from './components/Home.vue'
import Choose from './components/Choose.vue'
export const routes = [
    {path: '/expression', name: 'expression',component:  Loader, props:true},
    {path: '/choose', component:  Choose},
    {path: '/', component:  Home}
]