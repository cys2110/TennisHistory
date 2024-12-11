<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_INDEX } from '@/services/PlayerService'
import { unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Index } from '@/utils/types';
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints';

const { isBreakpointOrUp } = useGlobalBreakpoints()

// Variables
const props = defineProps<{
  name: string
  id: string
}>()
const index: Ref<Index[] | null> = ref(null)
const checked = ref(false)
const pages = [
  { title: 'Overview', name: 'player' },
  { title: 'Activity', name: 'activity' },
  { title: 'Titles and Finals', name: 'titles' },
  { title: 'Stats', name: 'stats' }
]

// Update document title
watch(() => props.name, () => updateDocumentTitle(`WL Index | ${unencodeName(props.name)} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_INDEX(props.id)
const { result, loading, error } = useQuery(query, variables)

const getIndexValue = (win: number, loss: number) => {
  return (win / (win + loss)).toFixed(3)
}

watch(result, (newResult) => {
  if (newResult) {
    const {
      lhWins,
      lhLosses,
      rhWins,
      rhLosses,
      lose1Wins,
      lose1Losses,
      win1Wins,
      win1Losses,
      outdoorWins,
      outdoorLosses,
      outdoorTitles,
      indoorWins,
      indoorLosses,
      indoorTitles,
      carpetWins,
      carpetLosses,
      carpetTitles,
      hardWins,
      hardLosses,
      hardTitles,
      grassWins,
      grassLosses,
      grassTitles,
      clayWins,
      clayLosses,
      clayTitles,
      set5Wins,
      set5Losses,
      deciderWins,
      deciderLosses,
      finalsWins,
      finalsLosses,
      v10Wins,
      v10Losses,
      tbWins,
      tbLosses,
      mastersWins,
      mastersLosses,
      mastersTitles,
      gsWins,
      gsLosses,
      gsTitles,
      wins,
      losses,
      titles,
    } = newResult.players[0].index
    const data = [
      {
        category: 'Match Record',
        stat: 'Overall',
        win: wins,
        loss: losses,
        titles: titles,
      },
      {
        category: 'Match Record',
        stat: 'Grand Slams',
        win: gsWins,
        loss: gsLosses,
        titles: gsTitles,
      },
      {
        category: 'Match Record',
        stat: 'ATP Masters 1000',
        win: mastersWins,
        loss: mastersLosses,
        titles: mastersTitles,
      },
      { category: 'Pressure Points', stat: 'Tie breaks', win: tbWins, loss: tbLosses },
      { category: 'Pressure Points', stat: 'Versus Top 10', win: v10Wins, loss: v10Losses },
      { category: 'Pressure Points', stat: 'Finals', win: finalsWins, loss: finalsLosses },
      {
        category: 'Pressure Points',
        stat: 'Deciding Set',
        win: deciderWins,
        loss: deciderLosses,
      },
      {
        category: 'Pressure Points',
        stat: '5th Set Record',
        win: set5Wins,
        loss: set5Losses,
      },
      {
        category: 'Environment',
        stat: 'Clay',
        win: clayWins,
        loss: clayLosses,
        titles: clayTitles,
      },
      {
        category: 'Environment',
        stat: 'Grass',
        win: grassWins,
        loss: grassLosses,
        titles: grassTitles,
      },
      {
        category: 'Environment',
        stat: 'Hard',
        win: hardWins,
        loss: hardLosses,
        titles: hardTitles,
      },
      {
        category: 'Environment',
        stat: 'Carpet',
        win: carpetWins,
        loss: carpetLosses,
        titles: carpetTitles,
      },
      {
        category: 'Environment',
        stat: 'Indoor',
        win: indoorWins,
        loss: indoorLosses,
        titles: indoorTitles,
      },
      {
        category: 'Environment',
        stat: 'Outdoor',
        win: outdoorWins,
        loss: outdoorLosses,
        titles: outdoorTitles,
      },
      { category: 'Other', stat: 'After Winning 1st Set', win: win1Wins, loss: win1Losses },
      {
        category: 'Other',
        stat: 'After Losing 1st Set',
        win: lose1Wins,
        loss: lose1Losses,
      },
      { category: 'Other', stat: 'Vs. Right-Handers', win: rhWins, loss: rhLosses },
      { category: 'Other', stat: 'Vs. Left-Handers', win: lhWins, loss: lhLosses },
    ]
    index.value = data.map((item) => ({ ...item, value: getIndexValue(item.win, item.loss) }))
  }
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})
</script>

<template>
  <div v-if="index" class="lg:w-3/4 lg:mx-auto">
    <PageToolbar :pages>
      <template #start v-if="isBreakpointOrUp('md')">
        <ToggleButton v-model="checked" offIcon="pi pi-chart-bar" onIcon="pi pi-table" offLabel="" onLabel="" unstyled
          class="mb-5" pt:icon="text-cyan-600 text-3xl" pt:root="border-cyan-600 border-[1px] rounded px-2" />
      </template>
    </PageToolbar>
    <DataTable v-if="!checked" :value="index" rowGroupMode="subheader" groupRowsBy="category" stripedRows size="small">
      <Column field="category" header="Category" />
      <Column field="stat" class="!text-xs md:!text-base" />
      <Column field="win" header="Wins" class="!text-center !text-xs md:!text-base" />
      <Column field="loss" header="Losses" class="!text-center !text-xs md:!text-base" />
      <Column field="titles" header="Titles" class="!text-center !text-xs md:!text-base" />
      <Column field="value" header="Index" class="!text-center !text-xs md:!text-base" />
      <template #groupheader="{ data }">
        <div class="font-bold">{{ data.category }}</div>
      </template>
    </DataTable>
    <IndexChart v-if="checked" :index />
  </div>
  <Loading v-else :loading>
    <template #none>No data available</template>
  </Loading>
</template>

<style scoped>
:deep(.p-datatable-row-group-header) {
  background-color: var(--p-violet-800);
}

:deep(.p-datatable-column-header-content) {
  display: flex;
  justify-content: center;
}
</style>