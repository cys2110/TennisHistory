<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { GET_RESULTS } from '@/services/EventService'
import { unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Round, Match } from '@/utils/types'

// [FUTURE: FILTER BY DATE, COURT, UMPIRE, PLAYER]

const props = defineProps<{ name: string; year: string; eid: string; id: string }>()
const { name, year, eid, id } = props

const matches: Ref<(
  Pick<Round, 'round' | 'number'> & {
    matches: Pick<Match, 'court' | 'date' | 'duration_mins' | 'incomplete' | 'match_no' | 'umpire' | 'winner' | 'loser'>[];
  }
)[] | null> = ref(null);

// Update document title
watch(() => name, () => updateDocumentTitle(`Results | ${unencodeName(name)} ${year} | TennisHistory`), { immediate: true })

// API CALL
const { query, variables } = GET_RESULTS(parseInt(eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) matches.value = newResult.events[0].rounds
})

watch(error, (newError) => {
  if (newError) console.error(newError)
})

const pages = [
  { title: 'Details', name: 'event' },
  { title: 'Draw', name: 'draw' },
]
</script>

<template>
  <Toolbar class="mb-5">
    <template #end>
      <div class="flex items-center">
        <Button v-for="page in pages" :key="page.title" as="router-link" :label="page.title" size="small" rounded
          class="mx-2" raised :to="{ name: page.name }" />
      </div>
    </template>
  </Toolbar>
  <Accordion v-if="matches" :value="['0']" multiple>
    <AccordionPanel v-for="(round, index) in matches" :key="round.number" :value="index">
      <AccordionHeader>{{ round.round }}</AccordionHeader>
      <AccordionContent>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-10">
          <template v-for="match in round.matches" :key="match.match_no">
            <ResultCard v-if="match.winner?.player" :match :name :id :year :eid />
          </template>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
  <Loading v-else :loading>
    <template #none>No results available</template>
  </Loading>
</template>