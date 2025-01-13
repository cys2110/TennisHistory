import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import PlayerLayout from '@/views/player/PlayerLayout.vue'
import PlayerOverview from '@/views/player/PlayerOverview.vue'
import ActivityView from '@/views/player/ActivityView.vue'
import TitlesAndFinalsView from '@/views/player/TitlesAndFinalsView.vue'
import WlIndexView from '@/views/player/WlIndexView.vue'
import StatsView from '@/views/player/StatsView.vue'
import TournamentView from '@/views/TournamentView.vue'
import EventLayout from '@/views/event/EventLayout.vue'
import EventOverview from '@/views/event/EventOverview.vue'
import ResultsView from '@/views/event/ResultsView.vue'
import DrawView from '@/views/event/DrawView.vue'
import MatchView from '@/views/MatchView.vue'
import H2HView from '@/views/H2HView.vue'
import SearchView from '@/views/SearchView.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView,
    },
    {
      path: '/players/:name/:id',
      component: PlayerLayout,
      children: [
        {
          path: '',
          name: 'player',
          component: PlayerOverview,
        },
        {
          path: 'activity',
          name: 'activity',
          component: ActivityView,
        },
        {
          path: 'titles-and-finals',
          name: 'titles',
          component: TitlesAndFinalsView,
        },
        {
          path: 'wl-index',
          name: 'wl-index',
          component: WlIndexView,
        },
        {
          path: 'stats',
          name: 'stats',
          component: StatsView,
        },
      ],
    },
    {
      path: '/tournaments/:name/:tid',
      name: 'tournament',
      component: TournamentView,
    },
    {
      path: '/tournaments/:name/:tid/:year/:eid',
      component: EventLayout,
      children: [
        {
          path: '',
          name: 'event',
          component: EventOverview,
        },
        {
          path: 'results',
          name: 'results',
          component: ResultsView,
        },
        {
          path: 'draw',
          name: 'draw',
          component: DrawView,
        },
      ],
    },
    {
      path: '/tournaments/:name/:tid/:year/:eid/:mid',
      name: 'match',
      component: MatchView,
    },
    {
      path: '/h2h',
      redirect: '/h2h/jannik-sinner-v-alexander-zverev/s0ag-z355',
    },
    {
      path: '/h2h/:p1Name-v-:p2Name/:p1Id-:p2Id',
      name: 'h2h',
      component: H2HView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
  },
})

export default router
