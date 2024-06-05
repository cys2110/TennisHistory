import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TournamentView from '@/views/TournamentView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import PlayerView from '@/views/PlayerView.vue'
import EditionView from '@/views/EditionView.vue'
import AboutView from '@/views/AboutView.vue'
import MatchStats from '@/views/MatchStats.vue'
import H2HView from '../views/H2HView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView
    },
    {
      path: '/archive',
      name: 'Archive',
      component: ArchiveView,
      beforeEnter: (to, from, next) => {
        document.title = 'Results Archive | TennisHistory'
        next()
      }
    },
    {
      path: '/tournaments/:name/:id',
      name: 'Tournament',
      props: true,
      component: TournamentView
    },
    {
      path: '/tournaments/:name/:id/:editionNo',
      name: 'Edition',
      props: true,
      component: EditionView
    },
    {
      path: '/tournaments/:name/:id/:editionNo/:matchId',
      name: 'MatchStats',
      props: true,
      component: MatchStats
    },
    {
      path: '/players/:name/:id',
      name: 'Player',
      props: true,
      component: PlayerView
    },
    {
      path: '/h2h/:p1Name/:p1Id/:p2Name/:p2Id',
      name: 'H2H',
      props: true,
      component: H2HView
    }
  ]
})

export default router
