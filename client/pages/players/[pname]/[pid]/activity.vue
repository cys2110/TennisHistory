<script setup>
definePageMeta({ name: 'activity', layout: 'player-layout' })
const route = useRoute()
const pid = ref(route.params.pid)
const year = ref()
const years = ref([])
const selectKey = ref(0)

// API calls
const { data: activeYears, status: yearsStatus, error: yearsError } = await useFetch('/api/getPlayerActiveYears', {
    method: 'GET',
    params: { pid: computed(() => pid.value) }
})

const { data: stats, status: statsStatus, error: statsError } = await useFetch('/api/getPlayerYearStats', {
    method: 'GET',
    params: { pid: computed(() => pid.value), year: computed(() => year.value) },
    immediate: false
})

const { data: events, status, error } = await useFetch('/api/getPlayerActivity', {
    method: 'GET',
    params: { pid: computed(() => pid.value), year: computed(() => year.value) },
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
        year.value = yearsArray[yearsArray.length - 1].value
        years.value = yearsArray
        selectKey.value++
    }
}, { immediate: true })

const links = computed(() => {
    if (events.value) {
        return events.value.map(event => ({
            label: event.name,
            to: `#${event.eid}`,
            exactHash: true
        }))
    }
})
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#player-toolbar-start">
                <FloatLabel variant="on">
                    <Select v-model="year" :key="selectKey" input-id="year_select" :options="years" option-label="label"
                        option-value="value" size="small">
                        <template #dropdownicon>
                            <Icon name="material-symbols:arrow-drop-down-circle-outline" class="text-lg" />
                        </template>
                    </Select>
                    <label for="year_select">Year</label>
                </FloatLabel>
            </Teleport>
        </ClientOnly>
        <div v-if="stats" class="flex justify-evenly">
            <Fieldset v-for="stat in stats" :key="stat.category" :legend="stat.category">
                <div class="font-bold text-3xl text-center">{{ stat.value }}</div>
            </Fieldset>
        </div>
        <div v-if="events" class="flex gap-10">
            <aside class="sticky top-[25%] h-fit">
                <u-vertical-navigation :links
                    :ui="{ base: 'mx-2 my-3', active: 'text-zinc-300', inactive: 'text-zinc-400', size: 'text-base' }">
                    <template #default="{ link }">
                        <span>{{ link.label }}</span>
                    </template>
                </u-vertical-navigation>
            </aside>
            <main class="flex flex-col gap-5 mt-10 w-full">
                <player-activity-card v-for="event in events" :key="event.eid" :event :year />
            </main>
        </div>
        <div v-else>
            <Message size="large" :severity="yearsStatus === 'pending' ? 'info' : 'warn'" variant="outlined"
                class="mt-5">
                <template #icon>
                    <Icon
                        :name="yearsStatus === 'pending' ? 'line-md:loading-twotone-loop' : 'pepicons-print:calendar-circle-off'"
                        class="text-2xl" />
                </template>
                <span v-if="yearsStatus === 'pending'" class="ml-2">Events are currently being fetched</span>
                <span v-else class="ml-2">No events available</span>
            </Message>
        </div>
    </div>
</template>