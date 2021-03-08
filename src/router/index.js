import Vue from 'vue'
import Router from 'vue-router'
import BY_index from '@/pages/BY_index'
import index from '@/pages/index'
import Rank from '@/pages/Rank'
import achieve from '@/pages/achieve'
import AR_Scan from '@/pages/AR_Scan'
import travel from '@/pages/travel'
import models from '@/pages/models'
import model from '@/pages/model'
import Scanmodels from '@/pages/Scanmodels'
import StorageRack from '@/pages/StorageRack'
import swiper from '@/components/swiper'

Vue.use(Router)
export default new Router({
  routes: [
    {path: '/',name: 'index',component: index},
    {path: '/BY_index',name: 'BY_index',component: BY_index},
    {path: '/Rank',name: 'Rank',component: Rank},
    {path: '/achieve',name: 'achieve',component: achieve},
    {path: '/AR_Scan',name: 'AR_Scan',component: AR_Scan},
    {path: '/travel',name: 'travel',component: travel},
    {path: '/models',name: 'models',component: models},
    {path: '/model',name: 'model',component: model},
    {path: '/Scanmodels',name: 'Scanmodels',component: Scanmodels},
    {path: '/StorageRack',name: 'StorageRack',component: StorageRack},
    {path: '/swiper',name: 'swiper',component: swiper}
  ]
})
