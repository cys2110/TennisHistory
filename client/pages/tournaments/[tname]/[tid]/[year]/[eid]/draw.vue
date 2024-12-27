<script setup>
import { useChangeCase } from '@vueuse/integrations'

definePageMeta({ name: 'draw', layout: 'event-layout' })
const route = useRoute()
const eid = ref(route.params.eid)
const selectedRound = ref(1)

const { data: results, status, error } = await useFetch('/api/getDraw', {
    method: 'GET',
    params: { eid: computed(() => eid.value) },
})

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
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#event-toolbar-start">
                <ButtonGroup v-if="results">
                    <Button v-for="round in results" :key="round.number.low" @click="selectedRound = round.number.low"
                        class="mx-2" size="small" rounded raised>{{
                            round.round
                        }}</Button>
                </ButtonGroup>
            </Teleport>
        </ClientOnly>
        <div v-if="results" class="hide-scrollbar flex flex-nowrap w-3/4 overflow-x-hidden mx-auto overflow-y-auto">
            <template v-for="round in results" :key="round.number.low">
                <div v-if="selectedRound > round.number.low - 1 && selectedRound < round.number.low + 3"
                    :id="useChangeCase(round.round, 'kebabCase')" class="shrink-0 w-[400px] mx-2">
                    <div class="text-center font-bold text-zinc-300">{{ round.round }}</div>
                    <div class="flex flex-col justify-around h-full">
                        <draw-card v-for="match in round.matches" :key="match.match_no" :match />
                    </div>
                </div>
            </template>
        </div>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:error-circle-rounded-outline-sharp'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">The event draw is currently being fetched</span>
                <span v-else class="ml-2">No draw available</span>
            </Message>
        </div>
    </div>
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