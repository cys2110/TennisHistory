<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { breakpointsTailwind, useAsyncState, useBreakpoints } from '@vueuse/core'
import { getArchiveTournaments } from '@/services/getArchiveTournaments'
import { Categories, MonthNames, Surfaces } from '@/types/enums'
import { FILTERED_CATEGORIES, FILTERED_SURFACES, MONTH_NAMES } from '@/utils/variables'
import Sidebar from '@/components/layout/Sidebar.vue'
import MultiSelectComponent from '@/components/primevue/MultiSelectComponent.vue'
import PageTitle from '@/components/layout/PageTitle.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import EventLoadingCard from '@/components/EventLoadingCard.vue'
import EventCard from '@/components/EventCard.vue'

document.title = 'Results Archive | TennisHistory'

const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual('lg')

const events = ref<EventCardType[]>([])
const sidebarLinks = ref<{ label: string; to: string }[]>([])

const surface: Ref<Surfaces[]> = ref([Surfaces.Clay, Surfaces.Grass, Surfaces.Hard])
const month: Ref<MonthNames[]> = ref([MonthNames.January, MonthNames.February, MonthNames.March, MonthNames.April, MonthNames.May, MonthNames.June, MonthNames.July, MonthNames.August, MonthNames.September, MonthNames.October, MonthNames.November, MonthNames.December])
const category: Ref<Categories[]> = ref([Categories['ATP 250'], Categories['ATP 500'], Categories['ATP Masters 1000'], Categories['Grand Slam'], Categories['Laver Cup'], Categories['Next Gen Finals'], Categories['ATP Finals']])
const year: Ref<string[]> = ref([new Date().getFullYear().toString()])
const years = Array.from({ length: 2025 - 1968 + 1 }, (_, index) => (1968 + index).toString())

const { error, isLoading, execute } = useAsyncState(
  () =>
    getArchiveTournaments(surface.value, month.value, category.value, year.value).then((results) => {
      events.value = results
      sidebarLinks.value = results.map((event: EventCardType) => ({
        label: event.tname,
        to: `#event-${event.eid}`
      }))
      return results
    }),
  [],
  { immediate: true }
)

watch(
  () => [surface.value, month.value, category.value, year.value],
  () => execute(),
  { immediate: true }
)
</script>

<template>
  <div class="grid grid-cols-12 p-10">
    <div class="col-span-10 px-5">
      <page-title>
        <template #heading>Results Archive</template>
      </page-title>
      <div v-if="events.length > 0 || isLoading" class="grid grid-cols-4 gap-5">
        <event-loading-card v-if="isLoading" v-for="i in new Array(3)" :key="i" />
        <event-card v-else v-for="event in events" :key="event.eid" :event />
      </div>
      <error-message v-if="error || (!isLoading && events.length < 0)" :icon="['fad', 'calendar-xmark']">
        <template #error-message>No upcoming tournaments</template>
      </error-message>
    </div>
    <Sidebar v-if="lgAndUp" :links="sidebarLinks">
      <template #filters>
        <multi-select-component v-model="year" label="Year" :options="years" />
        <multi-select-component v-model="surface" label="Surface" :options="FILTERED_SURFACES" />
        <multi-select-component v-model="month" label="Month" :options="MONTH_NAMES" />
        <multi-select-component v-model="category" label="Category" :options="FILTERED_CATEGORIES" />
      </template>
      <template #anchor-heading>
        <div class="text-slate-400">On this page</div>
      </template>
    </Sidebar>
  </div>
</template>
