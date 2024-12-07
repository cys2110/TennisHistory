<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GET_TOURNAMENT_YEARS } from '@/services/TournamentService'
import { GET_MATCH_BREADCRUMBS } from '@/services/MatchService'
import { unencodeName } from '@/utils/functions'

const route = useRoute()
const { name, id, eid, year, mid } = route.params

// Variables/interfaces
interface TournamentYears {
  id: number
  year: {
    id: number
  }
}
const tournamentYears: Ref<TournamentYears[] | null> = ref(null)

interface Round {
  round: string
  matches: {
    match_no: number
    p1: {
      player: {
        player: {
          full_name: string
        }
      } | null
    }
    p2: {
      player: {
        player: {
          full_name: string
        }
      } | null
    }
    incomplete: string | null
  }[]
}
const rounds: Ref<Round[] | null> = ref(null)

interface Match {
  match_no: number
  round: Round
  p1: {
    player: {
      player: {
        full_name: string
      }
    } | null
  }
  p2: {
    player: {
      player: {
        full_name: string
      }
    } | null
  }
  incomplete: string | null
}
const match: Ref<Match | null> = ref(null)
const pages = [
  { name: 'event', title: 'Details' },
  { name: 'results', title: 'Results' },
  { name: 'draw', title: 'Draw' },
]
const open = ref(false)
const selectedRound: Ref<Round | null> = ref(null)

const showDrawer = (round: Round) => {
  open.value = true
  selectedRound.value = round
}

// API calls
if (route.name !== 'match') {
  const { query, variables } = GET_TOURNAMENT_YEARS(parseInt(id as string))
  const { result, loading, error } = useQuery(query, variables)

  watch(result, (newResult) => {
    if (newResult) tournamentYears.value = newResult.tournaments[0].events
  })

  watch(error, (newError) => {
    if (newError) console.error(newError)
  })
} else {
  const { query, variables } = GET_MATCH_BREADCRUMBS(
    parseInt(id as string),
    parseInt(eid as string),
    parseInt(mid as string),
  )
  const { result, loading, error } = useQuery(query, variables)
  watch(result, (newResult) => {
    if (newResult) {
      tournamentYears.value = newResult.tournaments[0].events
      rounds.value = newResult.events[0].rounds
      match.value = newResult.matches[0]
    }
  })

  watch(error, (newError) => {
    if (newError) console.error(newError)
  })
}
</script>

<template>
  <a-breadcrumb v-if="tournamentYears">
    <a-breadcrumb-item>
      <router-link :to="{ name: 'home' }">Home</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <router-link
        v-if="route.name !== 'tournament'"
        :to="{ name: 'tournament', params: { name: name, id: id } }"
      >
        {{ unencodeName(name as string) }}</router-link
      >
      <span v-else>{{ unencodeName(name as string) }}</span>
      <template #overlay>
        <a-menu>
          <template v-for="event in tournamentYears" :key="event.id">
            <a-menu-item v-if="route.name === 'tournament' || parseInt(eid as string) !== event.id">
              <router-link
                :to="{ name: 'event', params: { year: event.year.id, eid: event.id } }"
                >{{ event.year.id }}</router-link
              >
            </a-menu-item>
          </template>
        </a-menu>
      </template>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="route.name !== 'tournament'">
      {{ year }}
      <template #overlay>
        <a-menu>
          <template v-for="page in pages" :key="page.name">
            <a-menu-item v-if="route.name !== page.name">
              <router-link :to="{ name: page.name }">{{ page.title }}</router-link>
            </a-menu-item>
          </template>
        </a-menu>
      </template>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="route.name === 'match' && match">
      {{ match.round.round }}
      <template #overlay>
        <a-menu>
          <template v-for="round in rounds" :key="round.round">
            <a-menu-item v-if="match.round.round !== round.round" @click="showDrawer(round)">
              {{ round.round }}
            </a-menu-item>
          </template>
        </a-menu>
      </template>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="route.name === 'match' && match">
      {{ match.p1?.player?.player.full_name }} vs. {{ match.p2?.player?.player.full_name }}
      <template #overlay>
        <a-menu>
          <template v-for="roundMatch in match.round.matches" :key="roundMatch.match_no">
            <a-menu-item v-if="parseInt(mid as string) !== roundMatch.match_no">
              <router-link :to="{ name: 'match', params: { mid: roundMatch.match_no } }"
                >{{ roundMatch.p1?.player?.player.full_name }} vs.
                {{ roundMatch.p2?.player?.player.full_name }}</router-link
              >
            </a-menu-item>
          </template>
        </a-menu>
      </template>
    </a-breadcrumb-item>
  </a-breadcrumb>
  <a-drawer
    v-if="selectedRound"
    v-model:open="open"
    :title="selectedRound.round"
    class="!bg-violet-800"
  >
    <div v-for="roundsMatch in selectedRound.matches" :key="roundsMatch.match_no" class="my-1">
      <router-link
        v-if="!roundsMatch.incomplete"
        class="hover-link"
        :to="{ name: 'match', params: { mid: roundsMatch.match_no } }"
        >{{ roundsMatch.p1?.player?.player.full_name }} vs.
        {{ roundsMatch.p2?.player?.player.full_name }}</router-link
      >
      <div v-else-if="roundsMatch.incomplete === 'WO'">
        {{ roundsMatch.p1?.player?.player.full_name }} vs.
        {{ roundsMatch.p2?.player?.player.full_name }} (Walkover)
      </div>
      <div v-else-if="roundsMatch.p1?.player || roundsMatch.p2?.player">
        {{
          roundsMatch.p1?.player?.player.full_name || roundsMatch.p2?.player?.player.full_name
        }}
        (BYE)
      </div>
    </div>
  </a-drawer>
</template>
