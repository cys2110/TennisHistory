<script setup lang="ts">
import Select from 'primevue/select'
import { GET_UPCOMING } from '@/services/EventService'

// Url params
const title = useTitle('Upcoming Tournaments | TennisHistory')
const searchParams = useUrlSearchParams('history')

// Variables
const events: Ref<EventCard[]> = ref([])
const baseOption = { label: 'All', value: null }

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
const surfaces = [baseOption,
  { label: 'Clay', value: 'Clay' },
  { label: 'Grass', value: 'Grass' },
  { label: 'Hard', value: 'Hard' },
  { label: 'Carpet', value: 'Carpet' }
]

// Filters
const selectOptions = [
  { vModel: category, options: categories, label: 'Category' },
  { vModel: month, options: months, label: 'Month' },
  { vModel: surface, options: surfaces, label: 'Surface' }
]

// API call to get upcoming tournaments
const { query, variables } = GET_UPCOMING(surface, month, category)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) events.value = newResult.upcomingEvents
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <Title>
    <template #title>Upcoming Tournaments</template>
  </Title>
  <toolbar>
    <template #center>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Select v-for="select in selectOptions" :key="select.label" v-model="select.vModel" :options="select.options"
          optionLabel="label" optionValue="value" size="small" :placeholder="select.label" class="text-center"
          @change="(value) => searchParams[select.label.toLowerCase()] = value.value">
          <template #dropdownicon>
            <i class="fa-solid fa-caret-down text-zinc-400" />
          </template>
        </Select>
      </div>
    </template>
  </toolbar>
  <div v-if="events.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-5">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
  </div>
  <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-5">
    <LoadingCard v-for="i in new Array(3)" :key="i" />
  </div>
  <ErrorMessage v-else message="No upcoming tournaments found.">
    <template #icon>
      <i class="fa-duotone fa-solid fa-calendar-exclamation" />
    </template>
  </ErrorMessage>
</template>