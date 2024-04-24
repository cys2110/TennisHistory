import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Tournament from '@/views/Tournament.vue'
import ResultsArchive from '@/views/ResultsArchive.vue'
import Player from '@/views/Player.vue'
import Edition from '@/views/Edition.vue'
import MatchStats from '@/views/Edition/MatchStats.vue'
import H2H from '@/views/H2H.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/results-archive',
      name: 'Results Archive',
      component: ResultsArchive
    },
    {
      path: '/tournaments/:name/:id',
      name: 'Tournament',
      props: true,
      component: Tournament
    },
    {
      path: '/tournaments/:name/:id/:editionId',
      component: Edition,
      name: 'Edition',
      props: true,
      children: [
        {
          path: 'matches/:matchId',
          name: 'MatchStats',
          component: MatchStats,
          props: true
        }
      ]
    },
    {
      path: '/players/:name/:id',
      component: Player,
      props: true
    },
    {
      path: '/h2h',
      name: 'H2H',
      component: H2H,
      props: true
    }
  ]
})

export default router
