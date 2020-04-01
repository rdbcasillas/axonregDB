import Loader from './components/Loader.vue'
import Enhancer from './components/EnhancerList.vue'
import Home from './components/Home.vue'
import Choose from './components/Choose.vue'
export const routes = [
    {path: '/expression', name: 'expression',component:  Loader, props:true},
    {path: '/featurecount', name: 'featurecount',component:  Loader, props:true},
    {path: '/enhancer', name: 'enhancer',component:  Enhancer, props:true},
    {path: '/choose', component:  Choose},
    {path: '/', component:  Home}
]