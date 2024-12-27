<script setup>
definePageMeta({ name: 'home' })
useHead({ title: 'Upcoming Tournaments' })

// Filters
const baseOption = { label: 'All', value: 'All' }

// Surface filter
const surface = ref('All')
const surfaces = [baseOption,
    { label: 'Clay', value: 'Clay' },
    { label: 'Grass', value: 'Grass' },
    { label: 'Hard', value: 'Hard' },
    { label: 'Carpet', value: 'Carpet' }
]

// Month filter
const month = ref('All')
const baseMonths = MONTHS.map((month, index) => ({ label: month, value: index + 1 }))
const months = [baseOption, ...baseMonths]

// Category filter
const category = ref('All')
const baseCategories = CATEGORIES.map((category) => ({ label: category, value: category }))
const categories = [baseOption, ...baseCategories]

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
                    <float-label v-for="(select, index) in selectOptions" :key="select.label" class="w-full"
                        variant="on">
                        <Select :inputId="`select-${index}`" v-model="select.vModel" :options="select.options"
                            option-label="label" option-value="value" class="text-center" size="small">
                            <template #dropdownicon>
                                <Icon name="material-symbols:arrow-drop-down-circle-outline" class="text-lg" />
                            </template>
                        </Select>
                        <label :for="`select-${index}`">{{ select.label }}</label>
                    </float-label>
                </div>
            </template>
        </toolbar>
        <div v-if="events && events.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
            <event-card v-for="event in events" :key="event.eid" :event="event" />
        </div>
        <error-message v-else :status error-icon="pepicons-print:calendar-circle-off">
            <template #loading-message>Events are currently being fetched</template>
            <template #error-message>There are no upcoming events</template>
        </error-message>
    </div>
</template>