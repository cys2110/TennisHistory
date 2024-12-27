<script setup>
definePageMeta({ name: 'archive' })
useHead({ title: 'Results Archive' })

// Filters
// XXX: Update to current year
const year = ref(2024)
const surface = ref('All')
const month = ref('All')
const category = ref('All')
const years = Array.from({ length: 2024 - 1968 + 1 }, (_, index) => ({ label: 1968 + index, value: 1968 + index }))
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
    { vModel: year, options: years, label: 'Year' },
    { vModel: category, options: categories, label: 'Category' },
    { vModel: month, options: months, label: 'Month' },
    { vModel: surface, options: surfaces, label: 'Surface' }
]

const { data: events, status, error } = await useFetch('/api/getArchiveTournaments', {
    method: 'GET',
    params: { year: computed(() => year.value), surface: computed(() => surface.value), month: computed(() => month.value), category: computed(() => category.value) },
})
</script>

<template>
    <div>
        <page-title>
            <template #heading>Results Archive</template>
        </page-title>
        <toolbar>
            <template #center>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <!--FIXME: Styling of float label-->
                    <FloatLabel v-for="(select, index) in selectOptions" :key="select.label" class="w-full"
                        variant="on">
                        <Select :inputId="`select-${index}`" v-model="select.vModel" :options="select.options"
                            optionLabel="label" optionValue="value" :placeholder="select.label" class="text-center"
                            size="small">
                            <template #dropdownicon>
                                <Icon name="material-symbols:arrow-drop-down-circle-outline" class="text-lg" />
                            </template>
                        </Select>
                        <label :for="`select-${index}`">{{ select.label }}</label>
                    </FloatLabel>
                </div>
            </template>
        </toolbar>
        <div v-if="events" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
            <event-card v-for="event in events" :key="event.eid" :event="event" />
        </div>
        <div v-else>
            <Message size="large" :severity="status === 'pending' ? 'info' : 'warn'" variant="outlined" class="mt-5">
                <template #icon>
                    <Icon
                        :name="status === 'pending' ? 'line-md:loading-twotone-loop' : 'pepicons-print:calendar-circle-off'"
                        class="text-2xl" />
                </template>
                <span v-if="status === 'pending'" class="ml-2">Events are currently being fetched</span>
                <span v-else class="ml-2">No events available</span>
            </Message>
        </div>
    </div>
</template>