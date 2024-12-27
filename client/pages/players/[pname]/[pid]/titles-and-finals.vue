<script setup>
definePageMeta({ name: 'titles', layout: 'player-layout' })
const route = useRoute()
const pid = ref(route.params.pid)
const checked = ref(false)

// API call
const { data: results, status, error } = await useFetch('/api/getTitlesAndFinals', {
    method: 'GET',
    params: { pid: computed(() => pid.value) }
})
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#player-toolbar-start">
                <div class="flex items-center">
                    <ToggleSwitch v-model="checked" id="switch" />
                    <label class="ml-2 text-lg" for="switch">{{ checked ? 'Finals' : 'Titles' }}</label>
                </div>
            </Teleport>
        </ClientOnly>
        <event-timeline v-if="results" :events="checked ? results.finals : results.titles"
            :counts="checked ? results.finals_count : results.titles_count" />
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'pepicons-print:trophy-circle-off'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">Titles and finals are currently being fetched</span>
                <span v-else class="ml-2">No titles or finals details available.</span>
            </Message>
        </div>
    </div>
</template>