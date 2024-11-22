import { createRouter, createWebHistory } from 'vue-router'
import {
  HomeView,
  ArchiveView,
  TournamentView,
  EventDetailsView,
  ResultsView,
  DrawView,
  MatchView,
  PlayerDetailsView,
  ActivityView,
  IndexView,
  TitlesView,
  StatsView,
  SearchView,
  H2HView,
} from './pages'

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
      path: '/tournaments/:name/:id',
      name: 'tournament',
      props: true,
      component: TournamentView,
    },
    {
      path: '/tournaments/:name/:id/:year/:eid/overview',
      name: 'event',
      props: true,
      component: EventDetailsView,
    },
    {
      path: '/tournaments/:name/:id/:year/:eid/results',
      name: 'results',
      props: true,
      component: ResultsView,
    },
    {
      path: '/tournaments/:name/:id/:year/:eid/draw',
      name: 'draw',
      props: true,
      component: DrawView,
    },
    {
      path: '/tournaments/:name/:id/:year/:eid/:mid',
      name: 'match',
      props: true,
      component: MatchView,
    },
    {
      path: '/players/:name/:id/overview',
      name: 'player',
      props: true,
      component: PlayerDetailsView,
    },
    {
      path: '/players/:name/:id/activity',
      name: 'activity',
      props: true,
      component: ActivityView,
    },
    {
      path: '/players/:name/:id/titles-and-finals',
      name: 'titles',
      props: true,
      component: TitlesView,
    },
    {
      path: '/players/:name/:id/index',
      name: 'index',
      props: true,
      component: IndexView,
    },
    {
      path: '/players/:name/:id/stats',
      name: 'stats',
      props: true,
      component: StatsView,
    },
    {
      path: '/h2h/:p1Name/:p1Id/:p2Name/:p2Id',
      name: 'h2h',
      props: true,
      component: H2HView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
  ],
})

export default router
