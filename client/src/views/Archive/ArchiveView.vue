<script setup lang="ts">
import Select from 'primevue/select'
import { GET_ARCHIVE } from '@/services/EventService'

// Url params
const title = useTitle('Results Archive | TennisHistory')
const searchParams = useUrlSearchParams('history')

// Variables/interfaces
const events: Ref<EventCard[] | null> = ref(null)
const baseOption = { label: 'All', value: null }

// Year filters
// Years array starts from 1968 (Open Era)
const year = useToNumber(searchParams.year as string).value || DateTime.now().year
const years = Array.from({ length: useToNumber(useDateFormat(useNow(), 'YYYY').value).value - 1968 + 1 }, (_, index) => ({ label: 1968 + index, value: 1968 + index }))

// Category filters
const category = searchParams.category as string || null
const baseCategories = CATEGORIES.map((category) => ({ label: category, value: category }))
const categories = [baseOption, ...baseCategories]

// Month filters
const month = useToNumber(searchParams.month as string).value || null
const baseMonths = MONTHS.map((month, index) => ({ label: month, value: index + 1 }))
const months = [baseOption, ...baseMonths]

// Surface filters
const surface = searchParams.surface as string || null
const surfaces = [
  { label: 'All', value: null },
  { label: 'Clay', value: 'Clay' },
  { label: 'Grass', value: 'Grass' },
  { label: 'Hard', value: 'Hard' },
  { label: 'Carpet', value: 'Carpet' }
]

// Filters
const selectOptions = [
  { vModel: year, options: years, label: 'Year' },
  { vModel: category, options: categories, label: 'Category' },
  { vModel: month, options: months, label: 'Month' },
  { vModel: surface, options: surfaces, label: 'Surface' }
]

// API call
const { query, variables } = GET_ARCHIVE(year, category, month, surface)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) events.value = newResult.archiveEvents
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <Title>
    <template #title>Results Archive</template>
  </Title>
  <toolbar>
    <template #center>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Select v-for="select in selectOptions" :key="select.label" v-model="select.vModel" :options="select.options"
          optionLabel="label" optionValue="value" size="small" class="text-center" :placeholder="select.label"
          @change="(value) => searchParams[select.label.toLowerCase()] = value.value">
          <template #dropdownicon>
            <i class="fa-solid fa-caret-down text-zinc-400" />
          </template>
        </Select>
      </div>
    </template>
  </toolbar>
  <div v-if="events" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
  </div>
  <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-5">
    <LoadingCard v-for="i in new Array(4)" :key="i" />
  </div>
  <ErrorMessage v-else message="No data available yet.">
    <template #icon>
      <i class="fa-duotone fa-solid fa-triangle-exclamation"></i>
    </template>
  </ErrorMessage>
</template>