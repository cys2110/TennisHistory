import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlayersView from '@/views/Players/PlayersView.vue'
import H2HView from '@/views/H2HView.vue'
import SearchView from '@/views/SearchView.vue'
import UpcomingView from '@/views/UpcomingView.vue'
import ArchiveView from '@/views/ArchiveView.vue'
import TournamentView from '@/views/TournamentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/upcoming',
      name: 'upcoming',
      component: UpcomingView
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView
    },
    {
      path: '/players',
      name: 'players',
      component: PlayersView
    },
    {
      path: '/tournaments',
      name: 'tournaments',
      component: TournamentView
    },
    {
      path: '/h2h',
      name: 'h2h',
      component: H2HView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
