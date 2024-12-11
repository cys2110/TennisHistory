<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_H2H } from '@/services/MiscService'
import { headshot, unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Match, Player } from '@/utils/types'

const buttonOptions = {
  outlinedPrimaryColor: '{cyan.600}',
  outlinedPrimaryBorderColor: '{cyan.600}'
}

const props = defineProps<{
  p1Name: string
  p1Id: string
  p2Name: string
  p2Id: string
}>()
const p1 = ref({
  name: props.p1Name ? unencodeName(props.p1Name) : 'Jannik Sinner',
  id: props.p1Id || 's0ag',
})
const p2 = ref({
  name: props.p2Name ? unencodeName(props.p2Name) : 'Alexander Zverev',
  id: props.p2Id || 'z355',
})
const p1Details: Ref<Pick<Player, 'bh1' | 'career_high' | 'ch_date' | 'country' | 'dob' | 'full_name' | 'height_cm' | 'id' | 'loss' | 'pm_USD' | 'rh' | 'titles' | 'turned_pro' | 'win'> | null> = ref(null)
const p1Url = ref('')
const p2Details: Ref<Pick<Player, 'bh1' | 'career_high' | 'ch_date' | 'country' | 'dob' | 'full_name' | 'height_cm' | 'id' | 'loss' | 'pm_USD' | 'rh' | 'titles' | 'turned_pro' | 'win'> | null> = ref(null)
const p2Url = ref('')
const matches: Ref<Pick<Match, 'match_no' | 'round' | 'winner' | 'loser'>[] | null> = ref(null)
const pieStats: Ref<{ name: string; value: number; itemStyle: { color: string } }[] | null> =
  ref(null)

// Update document title
watch(() => [props.p1Name, props.p2Name], () => updateDocumentTitle(`${p1.value.name} v. ${p2.value.name} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_H2H(p1.value.id, p2.value.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) {
    p1Details.value = newResult.p1[0]
    p2Details.value = newResult.p2[0]
    p1Url.value = headshot(newResult.p1[0].id)
    p2Url.value = headshot(newResult.p2[0].id)
    pieStats.value = [
      {
        name: unencodeName(props.p1Name),
        value: newResult.p1Wins.count,
        itemStyle: { color: '#0e7490' },
      },
      {
        name: unencodeName(props.p2Name),
        value: newResult.p2Wins.count,
        itemStyle: { color: '#5b21b6' },
      },
    ]
    matches.value = newResult.matches
  }
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})
</script>

<template>
  <Title>
    <template #title>{{ p1.name }} v. {{ p2.name }}</template>
  </Title>
  <div v-if="matches" class="w-3/4 mx-auto">
    <Toolbar class="mb-5 flex justify-evenly">
      <template #end>
        <div class="flex flex-col md:flex-row md:items-center md:justify-center items-start">
          <Button as="router-link" :label="`${p1Details?.full_name} Profile`" size="small" variant="outlined" rounded
            class="m-2" raised :to="{ name: 'player', params: { name: p1.name, id: p1.id } }" :dt="buttonOptions" />
          <Button as="router-link" :label="`${p2Details?.full_name} Profile`" size="small" variant="outlined" rounded
            class="m-2" raised :to="{ name: 'player', params: { name: p2.name, id: p2.id } }" :dt="buttonOptions" />
        </div>
      </template>
    </Toolbar>
    <div class="flex justify-evenly items-center">
      <div>
        <PlayerTable :player="p1Details" :number="1" />
      </div>
      <div>
        <H2HPieChart :stats="pieStats" />
        <H2HTable :p1="p1Details" :p2="p2Details" />
      </div>
      <div>
        <PlayerTable :player="p2Details" :number="2" />
      </div>
    </div>
    <MatchTable :matches />
  </div>
  <Loading v-else :loading>
    <template #none>No matches played against each other</template>
  </Loading>
</template>