<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable'
import { GET_INDEX } from '@/services/PlayerService'
import type { Index } from '@/utils/types';
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints';

const route = useRoute()
const { isBreakpointOrUp } = useGlobalBreakpoints()

// Variables
const props = defineProps<{
  name: string
  id: string
  pageNames: { title: string, name: string }[]
}>()
const index: Ref<Index[] | null> = ref(null)
const checked = ref(false)
const pages = props.pageNames.filter(page => page.name !== route.name)

// Index skeleton
const getIndexValue = (win: number, loss: number) => {
  return (win / (win + loss)).toFixed(3)
}
const indexConfig = [
  { category: 'Match Record', stat: 'Overall', keys: ['wins', 'losses', 'titles'] },
  { category: 'Match Record', stat: 'Grand Slams', keys: ['gsWins', 'gsLosses', 'gsTitles'] },
  { category: 'Match Record', stat: 'ATP Masters 1000', keys: ['mastersWins', 'mastersLosses', 'mastersTitles'] },
  { category: 'Pressure Points', stat: 'Tie breaks', keys: ['tbWins', 'tbLosses'] },
  { category: 'Pressure Points', stat: 'Versus Top 10', keys: ['v10Wins', 'v10Losses'] },
  { category: 'Pressure Points', stat: 'Finals', keys: ['finalsWins', 'finalsLosses'] },
  { category: 'Pressure Points', stat: 'Deciding Set', keys: ['deciderWins', 'deciderLosses'] },
  { category: 'Pressure Points', stat: '5th Set Record', keys: ['set5Wins', 'set5Losses'] },
  { category: 'Environment', stat: 'Clay', keys: ['clayWins', 'clayLosses', 'clayTitles'] },
  { category: 'Environment', stat: 'Grass', keys: ['grassWins', 'grassLosses', 'grassTitles'] },
  { category: 'Environment', stat: 'Hard', keys: ['hardWins', 'hardLosses', 'hardTitles'] },
  { category: 'Environment', stat: 'Carpet', keys: ['carpetWins', 'carpetLosses', 'carpetTitles'] },
  { category: 'Environment', stat: 'Indoor', keys: ['indoorWins', 'indoorLosses', 'indoorTitles'] },
  { category: 'Environment', stat: 'Outdoor', keys: ['outdoorWins', 'outdoorLosses', 'outdoorTitles'] },
  { category: 'Other', stat: 'After Winning 1st Set', keys: ['win1Wins', 'win1Losses'] },
  { category: 'Other', stat: 'After Losing 1st Set', keys: ['lose1Wins', 'lose1Losses'] },
  { category: 'Other', stat: 'Vs. Right-Handers', keys: ['rhWins', 'rhLosses'] },
  { category: 'Other', stat: 'Vs. Left-Handers', keys: ['lhWins', 'lhLosses'] },
]

// API call
const { query, variables } = GET_INDEX(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) {
    const rawIndex = newResult.players[0].index
    index.value = indexConfig.map(({ category, stat, keys }) => {
      const [winKey, lossKey, titleKey] = keys
      return {
        category,
        stat,
        win: rawIndex[winKey],
        loss: rawIndex[lossKey],
        titles: rawIndex[titleKey],
        value: getIndexValue(rawIndex[winKey], rawIndex[lossKey])
      }
    })
  }
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const handleToggle = () => {
  checked.value = !checked.value
}

// Table columns
const columns = [
  { field: 'category', header: 'Category' },
  { field: 'stat', header: '' },
  { field: 'win', header: 'Wins' },
  { field: 'loss', header: 'Losses' },
  { field: 'titles', header: 'Titles' },
  { field: 'value', header: 'Index' }
]
</script>

<template>
  <div v-if="index" class="lg:w-3/4 lg:mx-auto">
    <PageToolbar :pages>
      <template #start v-if="isBreakpointOrUp('md')">
        <ToggleButtonComponent :checked="checked" onIcon="fa-duotone fa-light fa-table"
          offIcon="fa-duotone fa-light fa-chart-bar" @toggle="handleToggle" />
      </template>
    </PageToolbar>
    <IndexTable v-if="!checked" :index :columns />
    <IndexChart v-else :index />
  </div>
  <Loading v-else :loading>
    <template #loading>
      <LoadingTable :columns />
    </template>
    <template #none>No data available</template>
  </Loading>
</template>