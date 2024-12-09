<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_DRAW } from '@/services/EventService'
import { encodeName, unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Round, Match } from '@/utils/types'
// import { html2pdf } from 'html2pdf.js';

// [FUTURE: FILTER BY PLAYER]
// [FUTURE: PDF OF DRAW]

const props = defineProps<{
  name: string
  id: string
  eid: string
  year: string
}>()
const matches: Ref<(
  Pick<Round, 'round' | 'number'> & {
    matches: (Pick<Match, 'incomplete' | 'match_no' | 'p1' | 'p2'> & { winner: { player: { player: { id: string } } } })[];
  }
)[] | null> = ref(null);
const selectedRound = ref(1)
const buttonOptions = { primaryBackground: '{cyan.500}', primaryBorderColor: '{cyan.500}' }

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Draw | ${unencodeName(props.name)} ${props.year} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_DRAW(parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) matches.value = newResult.events[0].rounds
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })

// const generatePdf = () => {
//     const chartElement = document.querySelector('#details');
//     const options = {
//         margin: 1,
//         filename: 'chart.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 1 },
//         jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
//     };

//     html2pdf()
//         .from(chartElement)
//         .set(options)
//         .outputPdf('blob') // Generates the PDF as a Blob
//         .then((pdfBlob) => {
//             // Create a URL for the Blob
//             const pdfUrl = URL.createObjectURL(pdfBlob);
//             // Open the URL in a new window or tab
//             window.open(pdfUrl, '_blank');
//         });
// };

const pages = [
  { title: 'Details', name: 'event' },
  { title: 'Results', name: 'results' },
]
</script>

<template>

  <Toolbar>
    <template #start>
      <ButtonGroup>
        <Button v-for="round in matches" :key="round.number" @click="selectedRound = round.number" class="mx-2"
          size="small" rounded raised :dt="buttonOptions">{{
            round.round
          }}</Button>
      </ButtonGroup>
    </template>
    <template #end>
      <div class="flex items-center">
        <Button v-for="page in pages" :key="page.title" as="router-link" :label="page.title" size="small" rounded
          class="mx-2" raised :to="{ name: page.name }" />
      </div>
    </template>
  </Toolbar>

  <div v-if="matches" class="hide-scrollbar flex flex-nowrap w-3/4 overflow-x-hidden mx-auto overflow-y-auto">
    <template v-for="round in matches" :key="round.number">
      <div v-if="selectedRound > round.number - 1 && selectedRound < round.number + 3" :id="encodeName(round.round)"
        class="shrink-0 w-[400px] mx-2">
        <div class="text-center font-bold">{{ round.round }}</div>
        <div class="flex flex-col justify-around h-full">
          <DrawCard v-for="match in round.matches" :key="match.match_no" :match :name :id :eid :year />
        </div>
      </div>
    </template>
  </div>

  <Loading v-else :loading>
    <template #none>No draw available</template>
  </Loading>
</template>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>