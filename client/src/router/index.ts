import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TournamentView from '@/views/TournamentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/tournaments/:name/:id',
      name: 'Tournament',
      props: true,
      component: TournamentView,
      beforeEnter: (to, from, next) => {
        const tournamentName = to.params.name
        // @ts-ignore
        document.title = `${tournamentName.replace(/_/g, ' ')} | TennisHistory`
        next()
      }
    }
  ]
})

export default router
