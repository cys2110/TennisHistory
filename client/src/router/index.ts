import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/Home.vue'
import About from '@/views/About.vue'
import Archive from '@/views/Archive/Archive.vue'
import Tournament from '@/views/Tournament/Tournament.vue'
import EventLayout from '@/views/Event/EventLayout.vue'
import EventOverview from '@/views/Event/EventOverview.vue'
import Results from '@/views/Event/Results.vue'
import Draw from '@/views/Event/Draw.vue'
import MatchStats from '@/views/Match/MatchStats.vue'
import PlayerLayout from '@/views/Player/PlayerLayout.vue'
import PlayerOverview from '@/views/Player/PlayerOverview.vue'
import Activity from '@/views/Player/Activity.vue'
import Titles from '@/views/Player/Titles.vue'
import WLIndex from '@/views/Player/WLIndex.vue'
import PlayerStats from '@/views/Player/PlayerStats.vue'
import H2H from '@/views/H2H/H2H.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/about',
            name: 'About',
            component: About
        },
        {
            path: '/archive',
            name: 'Archive',
            component: Archive,
            beforeEnter: (to, from, next) => {
                document.title = 'Results Archive | TennisHistory'
                next()
            }
        },
        {
            path: '/tournaments/:name/:id',
            name: 'Tournament',
            props: true,
            component: Tournament
        },
        {
            path: '/tournaments/:name/:id/:year/:eventId',
            props: true,
            component: EventLayout,
            children: [
                {
                    path: "",
                    name: 'Event',
                    props: true,
                    component: EventOverview
                },
                {
                    path: "results",
                    name: 'Results',
                    props: true,
                    component: Results
                },
                {
                    path: "draw",
                    name: 'Draw',
                    props: true,
                    component: Draw
                }
            ]
        },
        {
            path: '/tournaments/:name/:id/:year/:eventId/:matchId',
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
                    props: true,
                    component: PlayerOverview
                },
                {
                    path: "activity",
                    name: 'Activity',
                    props: true,
                    component: Activity
                },
                {
                    path: "titles_and_finals",
                    name: 'Titles',
                    props: true,
                    component: Titles
                },
                {
                    path: "wl_index",
                    name: "WL Index",
                    props: true,
                    component: WLIndex
                },
                {
                    path: "stats",
                    name: 'Player Stats',
                    props: true,
                    component: PlayerStats
                }
            ]
        },
        {
            path: '/h2h/:p1Name/:p1Id/:p2Name/:p2Id',
            name: 'H2H',
            props: true,
            component: H2H
        }
    ]
})

export default router