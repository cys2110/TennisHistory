<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { Grid } from 'ant-design-vue';
import { GET_DRAW } from '@/services/EventService';
import { encodeName, unencodeName, updateDocumentTitle } from '@/utils/functions';
import { DrawMatch } from '@/utils/types';
// import { html2pdf } from 'html2pdf.js';

// [FUTURE: FILTER BY PLAYER]
// [FUTURE: PDF OF DRAW]

const props = defineProps<{
    name: string
    id: string
    eid: string
    year: string
}>()
const { useBreakpoint } = Grid
const screens = useBreakpoint()
const matches: Ref<DrawMatch[] | null> = ref(null)
const anchorItems: Ref<{ number: number, round: string }[] | null> = ref(null)
const selectedRound: Ref<number | null> = ref(null)

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Draw | ${unencodeName(props.name)} ${props.year} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_DRAW(parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
    if (newResult) {
        matches.value = newResult.events[0].rounds
        if (matches.value) {
            anchorItems.value = matches.value.map(round => ({ number: round.number, round: round.round }))
            selectedRound.value = anchorItems.value[0].number
        }
    }
})
watch(error, (newError) => {
    if (newError) console.error(newError)
})

const handleChange = (e: number) => selectedRound.value = e

const cardWidth = computed(() => {
    if (screens.value.xl) return 'w-[30%]'
    if (screens.value.lg) return 'w-5/12'
    return 'w-full'
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
    <a-row v-if="matches">
        <a-col v-if="!screens.xs" :span="4">
            <div class="flex flex-col">
                <a-checkable-tag v-for="item in anchorItems" :key="item.number" :checked="selectedRound === item.number"
                    :value="item.number" class="my-2" @change="handleChange(item.number)">
                    {{ item.round }}</a-checkable-tag>
            </div>
        </a-col>
        <a-col :xs="24" :sm="20">
            <div v-if="screens.xs" class="flex overflow-x-auto scroll-smooth">
                <a-checkable-tag v-for="item in anchorItems" :key="item.number" :checked="selectedRound === item.number"
                    :value="item.number" class="my-2" @change="handleChange(item.number)">
                    {{ item.round }}</a-checkable-tag>
            </div>
            <a-row class="flex overflow-x-auto scroll-smooth" id="draw-container">
                <template v-for="round in matches" :key="round.round">
                    <a-col :xs="24"
                        v-if="selectedRound && ((screens.sm && selectedRound === round.number) || (screens.lg && selectedRound > round.number - 1 && selectedRound < round.number + 2) || (screens.xl && selectedRound > round.number - 1 && selectedRound < round.number + 3))"
                        class="flex-[0_0_auto] mx-4 flex flex-col justify-around items-center mb-2 font-bold"
                        :class="cardWidth">
                        {{ round.round }}
                    </a-col>
                </template>
            </a-row>
            <a-row class="flex overflow-x-auto scroll-smooth" id="draw-container">
                <template v-for="round in matches" :key="round.round">
                    <a-col :xs="24"
                        v-if="selectedRound && ((screens.sm && selectedRound === round.number) || (screens.lg && selectedRound > round.number - 1 && selectedRound < round.number + 2) || (screens.xl && selectedRound > round.number - 1 && selectedRound < round.number + 3))"
                        class="flex-[0_0_auto] mx-4 flex flex-col justify-around" :id="encodeName(round.round)"
                        :class="cardWidth">
                        <DrawCard v-for="match in round.matches" :key="match.match_no" :match :name :id :eid :year />
                    </a-col>
                </template>
            </a-row>
        </a-col>
    </a-row>
    <Loading v-else :loading>
        <template #none>No draw available</template>
    </Loading>
</template>