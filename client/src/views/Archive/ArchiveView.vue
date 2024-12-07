<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import Select from 'primevue/select'
import { DateTime } from 'luxon'
import { GET_ARCHIVE } from '@/services/EventService'
import type { EventCard } from '@/utils/types'
import { CATEGORIES, MONTHS } from '@/utils/variables'

// [TODO: ADD FILTERS BY MONTH AND CATEGORY]

const router = useRouter()
const route = useRoute()

// Update document title
document.title = 'Results Archive | TennisHistory'

// Variables
const events: Ref<EventCard[] | null> = ref(null)

// Filter by year
const years = Array.from({ length: DateTime.now().year - 1968 + 1 }, (_, index) => ({
  label: 1968 + index,
  value: 1968 + index,
}))
const searchYear = ref(
  route.query.year ? parseInt(route.query.year as string) : DateTime.now().year,
)

// Filter by category
const selectedCategory: Ref<string | null> = ref("All")
const categories = Object.entries(CATEGORIES).map(([key, value]) => ({
  label: key,
  value: value,
}))

// Filter by month
const selectedMonth: Ref<string | null> = ref("All")
const months = Object.entries(MONTHS).map(([key, value]) => ({
  label: key,
  value: value,
}))

const selectOptions = [
  {
    inputId: 'year_label',
    vModel: searchYear,
    options: years,
    label: 'Year',
  },
  {
    inputId: 'category_label',
    vModel: selectedCategory,
    options: categories,
    label: 'Category',
  },
  {
    inputId: 'month_label',
    vModel: selectedMonth,
    options: months,
    label: 'Month',
  },
]

// API call
const { query, variables } = GET_ARCHIVE(searchYear.value)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) events.value = newResult.events
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })

// Handle year selection
const handleSelection = () => router.push({ query: { year: searchYear.value } })
</script>

<template>
  <Title>
    <template #title>Results Archive</template>
  </Title>
  <div class="flex justify-evenly w-1/3">
    <FloatLabel v-for="select in selectOptions" :key="select.inputId" variant="on">
      <Select :inputId="select.inputId" v-model="select.vModel" :options="select.options" optionLabel="label"
        optionValue="value" variant="filled" size="small" filter checkmark class="mb-10" @change="handleSelection" />
      <label :for="select.inputId">{{ select.label }}</label>
    </FloatLabel>
  </div>
  <div v-if="events" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 w-3/4 mx-auto">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
  </div>
  <Loading v-else :loading>
    <template #none>No tournaments played</template>
  </Loading>
</template>