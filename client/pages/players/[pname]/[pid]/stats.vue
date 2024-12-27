<script setup>
definePageMeta({ name: 'stats', layout: 'player-layout' })
const route = useRoute()
const pid = ref(route.params.pid)
const visible = ref(false)
const checkedSurfaces = ref(true)
const selectedYears = ref([])
const years = ref([])
const selectKey = ref(0)
const selectedSurfaces = ref(['Clay', 'Grass', 'Hard', 'Carpet'])
const surfaces = [
    { name: 'Clay', value: 'Clay' },
    { name: 'Grass', value: 'Grass' },
    { name: 'Hard', value: 'Hard' },
    { name: 'Carpet', value: 'Carpet' }
]

// API calls
const { data: activeYears, status: yearsStatus, error: yearsError } = await useFetch('/api/getPlayerActiveYears', {
    method: 'GET',
    params: { pid: computed(() => pid.value) }
})

const { data: stats, status, error } = await useFetch('/api/getPlayerStats', {
    method: 'GET',
    params: { pid: computed(() => pid.value), years: computed(() => selectedYears.value), surfaces: computed(() => selectedSurfaces.value) },
    immediate: false
})

// Update select options for years
watch(() => activeYears.value, (newValue) => {
    if (newValue) {
        const yearsArray = Array.from(
            { length: newValue.end.low - newValue.start.low + 1 },
            (_, index) => ({
                label: (newValue.start.low + index).toString(),
                value: newValue.start.low + index
            })
        )
        selectedYears.value = yearsArray.map((year) => year.value)
        years.value = yearsArray
        selectKey.value++
    }
}, { immediate: true })

// Handle check all surfaces checkbox
const handleCheckSurfaces = (e) => {
    if (e === true) {
        selectedSurfaces.value = ['Clay', 'Grass', 'Hard', 'Carpet']
    } else {
        selectedSurfaces.value = ['Clay']
    }
}

// Check all surfaces checkbox if all surfaces select buttons are selected
watch(() => selectedSurfaces.value, () => {
    if (selectedSurfaces.value.length === 4) {
        checkedSurfaces.value = true
    } else {
        checkedSurfaces.value = false
    }
}, { immediate: true })
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#player-toolbar-start">
                <toggle-button v-model="visible" size="small" class="hidden md:inline-flex">
                    <template #icon>
                        <Icon :name="visible ? 'ph:table-duotone' : 'material-symbols:bar-chart-4-bars-rounded'"
                            class="text-2xl" />
                    </template>
                </toggle-button>
            </Teleport>
        </ClientOnly>
        <toolbar v-if="activeYears" class="mb-5 justify-between">
            <template #start>
                <FloatLabel variant="on">
                    <multi-select :key="selectKey" display="chip" inputId="year_select" v-model="selectedYears"
                        :options="years" option-label="label" option-value="value" size="small">
                        <template #dropdownicon>
                            <Icon name="material-symbols:arrow-drop-down-circle-outline"
                                class="text-lg text-zinc-400" />
                        </template>
                    </multi-select>
                    <label for="year_select">Year</label>
                </FloatLabel>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <div>
                        <u-checkbox label="All surfaces" v-model="checkedSurfaces" class="accent-emerald-600"
                            @update:model-value="handleCheckSurfaces"
                            :ui="{ label: 'text-zinc-700 dark:text-zinc-400', wrapper: 'flex items-center gap-1' }" />
                    </div>
                    <select-button v-model="selectedSurfaces" :options="surfaces" option-label="name" multiple
                        optionValue="value" class="!text-zinc-800">
                        <template #option="{ option }">
                            <div>{{ option.value }}</div>
                        </template>
                    </select-button>
                </div>
            </template>
        </toolbar>
        <div v-if="stats">
            <player-stats-table v-if="!visible" :stats />
            <player-stats-chart v-else :stats />
        </div>
        <error-message v-else :status="yearsStatus" error-icon="material-symbols:bar-chart-off-rounded">
            <template #loading-message>Player stats are currently being fetched</template>
            <template #error-message>No player stats available</template>
        </error-message>
    </div>
</template>

<style scoped>
:deep(.p-chip-remove-icon) {
    @apply text-zinc-500 dark:text-zinc-400
}
</style>