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
            value: indice.wins.low === 0 && indice.losses.low === 0 ? 0 : parseFloat((indice.wins.low / (indice.wins.low + indice.losses.low)).toFixed(3))
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
                    <toggle-button v-model="visible" size="small" class="hidden md:inline-flex">
                        <template #icon>
                            <Icon class="text-2xl"
                                :name="visible ? 'ph:table-duotone' : 'material-symbols:bar-chart-4-bars-rounded'" />
                        </template>
                    </toggle-button>
                </Teleport>
            </ClientOnly>
            <wlindex-table v-if="!visible" :index />
            <wlindex-chart v-else :index />
        </div>
        <error-message v-else :status error-icon="material-symbols:bar-chart-off-rounded">
            <template #loading-message>The index is currently being fetched</template>
            <template #error-message>No index available</template>
        </error-message>
    </div>
</template>