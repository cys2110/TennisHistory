import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Tournament from '@/views/Tournament.vue'
import ResultsArchive from '@/views/ResultsArchive.vue'
import Player from '@/views/Player.vue'
import Edition from '@/views/Edition.vue'
import MatchStats from '@/views/MatchStats.vue'
import About from '@/views/About.vue'
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
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/results-archive',
      name: 'Results Archive',
      component: ResultsArchive,
      beforeEnter: (to, from, next) => {
        document.title = `Results Archive | Tennis History`;
        next();
      }
    },
    {
      path: '/tournaments/:name/:id',
      name: 'Tournament',
      props: true,
      component: Tournament,
      beforeEnter: (to, from, next) => {
        document.title = `${to.params.name} | Tennis History`;
        next();
      }
    },
    {
      path: '/tournaments/:name/:id/:year/:editionId',
      component: Edition,
      name: 'Edition',
      props: true,
      beforeEnter: (to, from, next) => {
        document.title = `${to.params.name} ${to.params.year} | Tennis History`;
        next();
      }
    },
    {
      path: '/tournaments/:name/:id/:year/:editionId/matches/:matchId',
      name: 'MatchStats',
      component: MatchStats,
      props: true,
      beforeEnter: (to, from, next) => {
        document.title = `${to.params.name} ${to.params.year} | Tennis History`;
        next();
      }
    },
    {
      path: '/players/:name/:id',
      component: Player,
      name: 'Player',
      props: true,
      beforeEnter: (to, from, next) => {
        document.title = `${to.params.name} | Tennis History`;
        next();
      }
    },
    {
      path: '/h2h/:p1Name/:p1Id/:p2Name/:p2Id',
      name: 'H2H',
      component: H2H,
      props: true,
      beforeEnter: (to, from, next) => {
        document.title = `${to.params.p1Name} v. ${to.params.p2Name} | Tennis History`;
        next();
      }
    }
  ]
})

export default router
