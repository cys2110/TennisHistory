<script setup>
definePageMeta({ name: 'results', layout: 'event-layout' })
const route = useRoute()
const eid = ref(route.params.eid)

// API call
const { data: results, status, error } = await useFetch('/api/getResults', {
    method: 'GET',
    params: { eid: computed(() => eid.value) },
})
</script>

<template>
    <div>
        <stepper v-if="results && results.length > 0" :value="SHORT_ROUNDS[results[0].round]">
            <step-list>
                <step v-for="round in results" :key="round.round" :value="SHORT_ROUNDS[round.round]" />
            </step-list>
            <step-panels>
                <step-panel v-for="(round, index) in results" :key="index" :value="SHORT_ROUNDS[round.round]">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-8 md:gap-x-12 mt-5">
                        <template v-for="match in round.matches" :key="match.match_no">
                            <result-card v-if="match.winner_name" :match />
                        </template>
                    </div>
                </step-panel>
            </step-panels>
        </stepper>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:error-circle-rounded-outline-sharp'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">The event results are currently being fetched</span>
                <span v-else class="ml-2">No results available</span>
            </Message>
        </div>
    </div>
</template>