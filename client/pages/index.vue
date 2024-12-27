<script setup>
definePageMeta({ name: 'home' })
useHead({ title: 'Upcoming Tournaments' })

// Filters
const surface = ref('All')
const month = ref('All')
const category = ref('All')
const baseOption = { label: 'All', value: 'All' }
const baseCategories = CATEGORIES.map((category) => ({ label: category, value: category }))
const categories = [baseOption, ...baseCategories]
const baseMonths = MONTHS.map((month, index) => ({ label: month, value: index + 1 }))
const months = [baseOption, ...baseMonths]
const surfaces = [baseOption,
    { label: 'Clay', value: 'Clay' },
    { label: 'Grass', value: 'Grass' },
    { label: 'Hard', value: 'Hard' },
    { label: 'Carpet', value: 'Carpet' }
]

const selectOptions = [
    { vModel: category, options: categories, label: 'Category' },
    { vModel: month, options: months, label: 'Month' },
    { vModel: surface, options: surfaces, label: 'Surface' }
]

// API call to get upcoming tournaments
const { data: events, status, error } = await useFetch('/api/getUpcomingTournaments', {
    method: 'GET',
    params: { surface: computed(() => surface.value), month: computed(() => month.value), category: computed(() => category.value) },
})
</script>

<template>
    <div id="home-page">
        <page-title>
            <template #heading>Upcoming Tournaments</template>
        </page-title>
        <toolbar>
            <template #center>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Select v-for="select in selectOptions" :key="select.label" v-model="select.vModel"
                        :options="select.options" optionLabel="label" optionValue="value" :placeholder="select.label"
                        class="text-center" size="small">
                        <template #dropdownicon>
                            <Icon name="material-symbols:arrow-drop-down-circle-outline" class="text-lg" />
                        </template>
                    </Select>
                </div>
            </template>
        </toolbar>
        <div v-if="events && events.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
            <event-card v-for="event in events" :key="event.eid" :event="event" />
        </div>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'material-symbols:error-circle-rounded-outline-sharp'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">Events are currently being fetched</span>
                <span v-else class="ml-2">There are no upcoming events</span>
            </Message>
        </div>
    </div>
</template>