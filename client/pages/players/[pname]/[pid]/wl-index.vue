<script setup>
definePageMeta({ name: 'index', layout: 'player-layout' })
const route = useRoute()
const pid = ref(route.params.pid)
const visible = ref(false)

// API call
const { data: wlindex, status, error } = await useFetch('/api/getWLIndex', {
    method: 'GET',
    params: { pid: computed(() => pid.value) }
})

const index = computed(() => {
    if (wlindex) {
        const formattedIndex = wlindex.value.map(indice => ({
            ...indice,
            wins: indice.wins.low,
            losses: indice.losses.low,
            titles: indice.titles?.low || null,
            value: parseFloat((indice.wins.low / (indice.wins.low + indice.losses.low)).toFixed(3))
        }))

        return formattedIndex
    }
    return null
})
</script>

<template>
    <div>
        <div v-if="wlindex">
            <ClientOnly>
                <Teleport to="#player-toolbar-start">
                    <toggle-button v-model="visible" size="small">
                        <template #icon>
                            <Icon :name="visible ? 'ph:table-duotone' : 'material-symbols:bar-chart-4-bars-rounded'"
                                class="text-2xl" />
                        </template>
                    </toggle-button>
                </Teleport>
            </ClientOnly>
            <wlindex-table v-if="!visible" :index />
            <wlindex-chart v-else :index />
        </div>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:bar-chart-off-rounded'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">The index is currently being fetched</span>
                <span v-else class="ml-2">No index available</span>
            </Message>
        </div>
    </div>
</template>