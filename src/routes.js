import SinglePlot from './components/SinglePlot.vue'
import Enhancer from './components/EnhancerList.vue'
import TfBinding from './components/TfBinding.vue'
import enhancerTFCompare from './components/enhancerTFCompare.vue'
import selectEnhancerAnalysis from './components/selectEnhancerAnalysis.vue'
import findGeneTargets from './components/findGeneTargets.vue'
import findBoundTF from './components/findBoundTF.vue'
import PromoterFoot from './components/PromoterFoot.vue'
import EnhancerFoot from './components/EnhancerFoot.vue'
import IGVTest from './components/charts/IGVTest.vue'
//import Home from './components/Home.vue'
import SelectModule from './components/SelectModule.vue'
import frontPage from './components/frontPage.vue'
export const routes = [
    {path: '/expression', name: 'expression',component:  SinglePlot, props:true},
    {path: '/featurecount', name: 'featurecount',component:  SinglePlot, props:true},
    {path: '/histone', name: 'histone',component:  SinglePlot, props:true},
    {path: '/enhancer', name: 'enhancer',component:  Enhancer, props:true},
    {path: '/tfbind', name: 'tfbind',component:  TfBinding, props:true},
    {path: '/promotertf', name: 'promotertf',component:  PromoterFoot, props:true},
    {path: '/enhancertf', name: 'enhancertf',component:  EnhancerFoot, props:true},
    {path: '/enhancertfcompare', name: 'enhancertfcompare',component:  enhancerTFCompare, props:true},
    {path: '/selectenhanceranalysis', name: 'selectenhanceranalysis',component:  selectEnhancerAnalysis, props:true},
    {path: '/genetarget', name: 'genetarget',component:  findGeneTargets, props:true},
    {path: '/boundtf', name: 'boundtf',component:  findBoundTF, props:true},
    {path: '/select', component:  SelectModule},
    {path: '/igvtest', component:  IGVTest},
    {path: '/', component:  SelectModule},
    {path: '/home', component:  frontPage},
    //{path: '/', component:  Home}
]