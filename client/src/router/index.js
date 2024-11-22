import HomeView from '@/views/Home/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    // {
    //   name: 'archive'
    // },
    // {
    //   name: 'tournament'
    // },
    // {
    //   name: 'event',
    //   children: [
    //     {
    //       name: 'overview'
    //     },
    //     {
    //       name: 'results'
    //     },
    //     {
    //       name: 'draw'
    //     }
    //   ]
    // },
    // {
    //   name: 'match-stats'
    // },
    // {
    //   name: 'player',
    //   children: [
    //     {name: 'overview'},
    //     {name: 'activity'},
    //     {name: 'titles'},
    //     {name: 'index'},
    //     {name: 'player-stats'}
    //   ],
    // },
    // {
    //   name: 'h2h'
    // },
    // {
    //   name: 'search'
    // }
  ],
})

export default router
