<script setup>
import { useChangeCase } from '@vueuse/integrations';

const route = useRoute()
const p1Name = ref(route.params.p1Name)
const p2Name = ref(route.params.p2Name)
const p1Id = ref(route.params.p1Id)
const p2Id = ref(route.params.p2Id)

useHead({ title: `${useChangeCase(p1Name.value, 'capitalCase').value} vs ${useChangeCase(p2Name.value, 'capitalCase').value}` })

// API call
const { data: h2h, status, error } = await useFetch('/api/getH2H', {
    method: 'GET',
    params: { p1Id: computed(() => p1Id.value), p2Id: computed(() => p2Id.value) },
})

const winLoss = computed(() => {
    if (h2h.value) {
        const totalMatches = h2h.value.matches.length
        const p1Wins = h2h.value.matches.filter(match => match.winner_id === p1Id.value).length
        return [p1Wins, totalMatches - p1Wins]
    }
})

const p1 = computed(() => {
    if (h2h.value) {
        return {
            id: h2h.value.p1_id,
            name: h2h.value.p1_name,
            dob: h2h.value.p1_dob,
            height: h2h.value.p1_height?.low,
            rh: h2h.value.p1_rh,
            bh: h2h.value.p1_bh,
            pro: h2h.value.p1_pro,
            country: h2h.value.p1_country,
        }
    }
})

const p2 = computed(() => {
    if (h2h.value) {
        return {
            id: h2h.value.p2_id,
            name: h2h.value.p2_name,
            dob: h2h.value.p2_dob,
            height: h2h.value.p2_height?.low,
            rh: h2h.value.p2_rh,
            bh: h2h.value.p2_bh,
            pro: h2h.value.p2_pro,
            country: h2h.value.p2_country,
        }
    }
})
</script>

<template>
    <div>
        <page-title>
            <template #heading>
                {{ useChangeCase(p1Name, 'capitalCase').value }} vs. {{ useChangeCase(p2Name, 'capitalCase').value }}
            </template>
            <template #subtitle>Head to Head</template>
        </page-title>
        <div v-if="h2h">
            <toolbar>
                <template #end>
                    <Button variant="outlined" as="router-link" :label="`${h2h.p1_name} Profile`" size="small" rounded
                        raised :to="`/players/${p1Name}/${p1Id}`" />
                    <Button variant="outlined" as="router-link" :label="`${h2h.p2_name} Profile`" size="small" rounded
                        raised :to="`/players/${p2Name}/${p2Id}`" />
                </template>
            </toolbar>
            <div class="flex justify-evenly items-center">
                <div>
                    <h2h-player-card :player="p1"
                        colour="border-violet-700 shadow-violet-500 hover:shadow-violet-500" />
                </div>
                <div>
                    <h2h-doughnut-chart :winLoss />
                    <h2h-table :h2h />
                </div>
                <div>
                    <h2h-player-card :player="p2" colour="border-green-800 shadow-green-600 hover:shadow-green-600" />
                </div>
            </div>
            <h2h-match-table :matches="h2h.matches" />
        </div>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'pepicons-print:people-circle-off'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">The head to head is currently being fetched</span>
                <span v-else class="ml-2">No head to head information available</span>
            </Message>
        </div>
    </div>
</template>