import SinglePlot from './components/SinglePlot.vue'
import Enhancer from './components/EnhancerList.vue'
import TfBinding from './components/TfBinding.vue'
import findGeneTargets from './components/findGeneTargets.vue'
import findBoundTF from './components/findBoundTF.vue'
//import Home from './components/Home.vue'
import SelectModule from './components/SelectModule.vue'
export const routes = [
    {path: '/expression', name: 'expression',component:  SinglePlot, props:true},
    {path: '/featurecount', name: 'featurecount',component:  SinglePlot, props:true},
    {path: '/enhancer', name: 'enhancer',component:  Enhancer, props:true},
    {path: '/tfbind', name: 'tfbind',component:  TfBinding, props:true},
    {path: '/genetarget', name: 'genetarget',component:  findGeneTargets, props:true},
    {path: '/boundtf', name: 'boundtf',component:  findBoundTF, props:true},
    {path: '/select', component:  SelectModule},
    {path: '/', component:  SelectModule},
    //{path: '/', component:  Home}
]