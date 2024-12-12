<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import Select from 'primevue/select'
import { DateTime } from 'luxon'
import { GET_ACTIVITY } from '@/services/PlayerService'
import { unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Entry } from '@/utils/types'

// TODO ADD FILTER BY TOURNAMENT TYPE AND TOURNAMENT
// TODO DEFAULT TO LATEST YEAR

const route = useRoute()
const router = useRouter()

// Variables
const props = defineProps(['name', 'id'])
const selectedYear = ref(route.query.year ? parseInt(route.query.year as string) : DateTime.now().year)
const years: Ref<{ name: string, value: string }[]> = ref([])
const stats: Ref<{ category: string, value: number }[]> = ref([])
const events: Ref<Entry[] | null> = ref(null)

const pages = [
  { title: 'Overview', name: 'player' },
  { title: 'Titles and Finals', name: 'titles' },
  { title: 'Win-Loss Index', name: 'index' },
  { title: 'Stats', name: 'stats' }
]

const selectOptions = {
  borderColor: '{cyan.600}',
  focusBorderColor: '{cyan.400}',
}

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Activity | ${unencodeName(props.name)} | TennisHistory`), { immediate: true })

const handleSelection = () => router.push({ query: { year: selectedYear.value } })

// API call
const { query, variables } = GET_ACTIVITY(props.id, selectedYear.value)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) {
    // Set years in dropdown
    const earliest = newResult.players[0].years.earliest
    const latest = newResult.players[0].years.latest
    years.value = Array.from({ length: latest - earliest + 1 }, (_, index) => ({
      name: earliest + index,
      value: earliest + index,
    }))
    selectedYear.value = latest

    // Set stats
    stats.value = [{ category: 'Wins', value: newResult.yearStats.wins }, { category: 'Losses', value: newResult.yearStats.losses }, { category: 'Titles', value: newResult.yearStats.titles }]

    // Sort events by date and scores by match number
    const sortedEntries = [...newResult.players[0].entries]
      .map((entry) => ({
        ...entry,
        scores: [...entry.scores].sort((a, b) => b.match.match_no - a.match.match_no),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.scores[0].match.round.event.start_date)
        const dateB = new Date(b.scores[0].match.round.event.start_date)
        // @ts-ignore
        return dateA - dateB
      })
    events.value = sortedEntries
  }
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <div v-if="events" class="w-3/4 mx-auto">
    <PageToolbar :pages>
      <template #start>
        <FloatLabel variant="on">
          <Select inputId="year_select" v-model="selectedYear" :options="years" optionLabel="name" placeholder="Year"
            optionValue="value" @change="handleSelection" size="small" :dt="selectOptions" />
          <label for="year_select">Year</label>
        </FloatLabel>
      </template>
    </PageToolbar>
    <div class="flex justify-evenly">
      <Fieldset v-for="stat in stats" :key="stat.category" :legend="stat.category">
        <div class="font-bold text-3xl text-center">{{ stat.value }}</div>
      </Fieldset>
    </div>
    <ActivityCard v-for="(event, index) in events" :key="index" :event :name :id />
  </div>
  <Loading v-else :loading>
    <template #none>No events played</template>
  </Loading>
</template>