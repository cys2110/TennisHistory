import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Tournament from '@/views/Tournament.vue'
import ResultsArchive from '@/views/ResultsArchive.vue'
import PlayerLayout from '@/views/Player/PlayerLayout.vue'
import PlayerOverview from '@/views/Player/PlayerOverview.vue'
import TitlesAndFinals from '@/views/Player/TitlesAndFinals.vue'
import Activity from '@/views/Player/Activity.vue'
import Stats from '@/views/Player/Stats.vue'
import WLIndex from '@/views/Player/WLIndex.vue'
import EditionLayout from '@/views/Edition/EditionLayout.vue'
import EditionOverview from '@/views/Edition/EditionOverview.vue'
import Results from '@/views/Edition/Results.vue'
import Draw from '@/views/Edition/Draw.vue'
import MatchStats from '@/views/Edition/MatchStats.vue'
import H2H from '@/views/Player/H2H.vue'

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
      component: EditionLayout,
      props: true,
      children: [
        {
          path: '',
          name: 'EditionOverview',
          component: EditionOverview
        },
        {
          path: 'results',
          name: 'Results',
          component: Results
        },
        {
          path: 'draw',
          name: 'Draw',
          component: Draw
        },
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
      component: PlayerLayout,
      props: true,
      children: [
        {
          path: '',
          name: 'PlayerOverview',
          component: PlayerOverview
        },
        {
          path: 'titles-and-finals',
          name: 'Titles',
          component: TitlesAndFinals
        },
        {
          path: 'activity',
          name: 'Activity',
          component: Activity
        },
        {
          path: 'stats',
          name: 'PlayerStats',
          component: Stats
        },
        {
          path: 'wl-index',
          name: 'WLIndex',
          props: true,
          component: WLIndex
        }
      ]
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
