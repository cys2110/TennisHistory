import MatchStats from '@/views/MatchStats.vue'
import H2HView from '../views/H2HView.vue'
import Results from '@/views/Edition/Results.vue'
import Draw from '@/views/Edition/Draw.vue'

const router = createRouter({
  routes: [
    {
      children: [
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
      path: '/tournaments/:name/:id/:year/:editionNo/:matchId',
      name: 'MatchStats',
      props: true,
      component: MatchStats
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