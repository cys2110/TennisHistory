<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import Select from 'primevue/select'
import { DateTime } from 'luxon'
import { GET_ARCHIVE } from '@/services/EventService'
import type { EventCard } from '@/utils/types'
import { CATEGORIES, MONTHS } from '@/utils/variables'

const router = useRouter()
const route = useRoute()

// Update document title
document.title = 'Results Archive | TennisHistory'

// Variables
const events: Ref<EventCard[] | null> = ref(null)

interface Options {
  label: string
  value: string | number | null
}

// Year filters
const years = Array.from({ length: DateTime.now().year - 1968 + 1 }, (_, index) => ({ label: 1968 + index, value: 1968 + index }))
const searchYear = ref(
  route.query.year ? parseInt(route.query.year as string) : DateTime.now().year,
)

// Category filters
const selectedCategory: Ref<string | null> = ref(route.query.category ? route.query.category as string : null)
let categories: Options[] = Object.entries(CATEGORIES).map(([key, value]) => ({ label: key, value: value }))
categories = [
  { label: 'All', value: null },
  ...categories
]

// Month filters
const selectedMonth: Ref<number | null> = ref(route.query.month ? parseInt(route.query.month as string) : null)
let months: Options[] = Object.entries(MONTHS).map(([key, value]) => (
  { label: key, value: value }))
months = [
  { label: 'All', value: null },
  ...months
]

// Surface filters
const selectedSurface: Ref<string | null> = ref(route.query.surface ? route.query.surface as string : null)
const surfaces: Options[] = [
  { label: 'All', value: null },
  { label: 'Clay', value: 'Clay' },
  { label: 'Grass', value: 'Grass' },
  { label: 'Hard', value: 'Hard' },
  { label: 'Carpet', value: 'Carpet' }
]

// Filters
const selectOptions = [
  { vModel: searchYear, options: years, label: 'Year' },
  { vModel: selectedCategory, options: categories, label: 'Category' },
  { vModel: selectedMonth, options: months, label: 'Month' },
  { vModel: selectedSurface, options: surfaces, label: 'Surface' }
]

const handleSelection = (label: string) => {
  const queryYear = label === 'Year' ? searchYear.value : route.query.year
  const queryCategory = label === 'Category' ? selectedCategory.value : route.query.category
  const queryMonth = label === 'Month' ? selectedMonth.value : route.query.month
  const querySurface = label === 'Surface' ? selectedSurface.value : route.query.surface
  router.replace({ query: { year: queryYear, category: queryCategory, month: queryMonth, surface: querySurface } })
}

// API call
const { query, variables } = GET_ARCHIVE(searchYear.value, selectedCategory.value, selectedMonth.value, selectedSurface.value)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) events.value = newResult.archiveEvents
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <div class="lg:w-3/4 mx-auto">
    <Title>
      <template #title>Results Archive</template>
    </Title>
    <Toolbar>
      <template #center>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Select v-for="select in selectOptions" :key="select.label" v-model="select.vModel" :options="select.options"
            optionLabel="label" optionValue="value" variant="filled" size="small" filter checkmark class="text-center"
            :placeholder="select.label" @change="handleSelection(select.label)" />
        </div>
      </template>
    </Toolbar>
    <div v-if="events" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-5">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>
    <Loading v-else :loading>
      <template #loading>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <LoadingCard />
        </div>
      </template>
      <template #none>No tournaments played</template>
    </Loading>
  </div>
</template>