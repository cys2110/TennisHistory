import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TournamentView from '@/views/TournamentView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import PlayerLayout from '@/views/Player/PlayerLayout.vue'
import EditionLayout from '@/views/Edition/EditionLayout.vue'
import AboutView from '@/views/AboutView.vue'
import MatchStats from '@/views/MatchStats.vue'
import H2HView from '../views/H2HView.vue'
import PlayerOverview from '@/views/Player/PlayerOverview.vue'
import Titles from '@/views/Player/Titles.vue'
import WLIndex from '@/views/Player/WLIndex.vue'
import PlayerStats from '@/views/Player/PlayerStats.vue'
import Activity from '@/views/Player/Activity.vue'
import EditionOverview from '@/views/Edition/EditionOverview.vue'
import Results from '@/views/Edition/Results.vue'
import Draw from '@/views/Edition/Draw.vue'

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
      path: '/tournaments/:name/:id/:year/:editionNo',
      props: true,
      component: EditionLayout,
      children: [
        {
          path: "",
          props: true,
          name: 'Edition',
          component: EditionOverview
        },
        {
          path: "results",
          props: true,
          name: 'Results',
          component: Results
        },
        {
          path: "draw",
          props: true,
          name: 'Draw',
          component: Draw
        }
      ]
    },
    {
      path: '/tournaments/:name/:id/:editionNo/:matchId/',
      name: 'MatchStats',
      props: true,
      component: MatchStats
    },
    {
      path: '/players/:name/:id',
      props: true,
      component: PlayerLayout,
      children: [
        {
          path: "",
          name: 'Player',
          component: PlayerOverview
        },
        {
          path: 'activity',
          name: 'Activity',
          component: Activity,
          props: true
        },
        {
          path: 'titles_and_finals',
          name: 'Titles',
          component: Titles,
          props: true
        },
        {
          path: 'wl_index',
          name: 'WL Index',
          component: WLIndex,
          props: true
        },
        {
          path: 'stats',
          name: 'Player Stats',
          component: PlayerStats,
          props: true
        }
      ]
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
