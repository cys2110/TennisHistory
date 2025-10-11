<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"

useHead({ title: "Results Archive" })

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const smAndDown = breakpoints.smallerOrEqual("sm")

const page = ref(1)
const skip = ref(0)

// Filters
const selectedTournaments = ref<string[]>([])
const selectedLevels = ref<LevelType[]>([])
const selectedTours = ref<TourType[]>([])
const selectedCategories = ref<CategoryType[]>([])
const dateRange = shallowRef<{ start: CalendarDate | undefined; end: CalendarDate | undefined }>({
  start: undefined,
  end: undefined
})
const selectedEnvironments = ref<EnvironmentType[]>([])
const selectedSurfaces = ref<SurfaceType[]>([])
const selectedVenues = ref<string[]>([])
const selectedCountries = ref<string[]>([])
const selectedSupervisors = ref<string[]>([])
const selectedUmpires = ref<string[]>([])
const resetFilters = () => {
  set(selectedTournaments, [])
  set(selectedLevels, [])
  set(selectedCategories, [])
  set(dateRange, { start: undefined, end: undefined })
  set(selectedSurfaces, [])
  set(selectedVenues, [])
  set(selectedCountries, [])
  set(selectedSupervisors, [])
  set(selectedUmpires, [])
}

watch(
  [
    selectedTournaments,
    selectedLevels,
    selectedCategories,
    dateRange,
    selectedSurfaces,
    selectedVenues,
    selectedCountries,
    selectedSupervisors,
    selectedUmpires,
    selectedTours,
    selectedEnvironments
  ],
  () => {
    set(skip, 0)
    set(page, 1)
  }
)

// API call
const { data, status } = await useFetch<{ count: number; events: EventInterface[] }>("/api/archive", {
  key: `results-archive-${selectedTournaments}-${skip}-${selectedUmpires}-${selectedSupervisors}-${selectedSurfaces}-${selectedCategories}-${selectedVenues}-${selectedCountries}-${selectedLevels}-${dateRange}-${selectedTours}-${selectedEnvironments}`,
  query: {
    skip,
    tournaments: selectedTournaments,
    umpires: selectedUmpires,
    supervisors: selectedSupervisors,
    surfaces: selectedSurfaces,
    categories: selectedCategories,
    venues: selectedVenues,
    countries: selectedCountries,
    levels: selectedLevels,
    tours: selectedTours,
    environments: selectedEnvironments,
    dateRange
  },
  default: () => ({ count: 0, events: [] })
})

const toc = computed(() => [
  {
    id: "tournaments",
    label: "Tournaments",
    items: data.value.events.map(event => ({
      label: `${event.tournament.name} ${event.year}`,
      to: `#event-${event.id}`
    }))
  }
])
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <filter-date-picker v-model="dateRange" />

          <filter-checkbox-levels v-model="selectedLevels" />

          <filter-checkbox-tours v-model="selectedTours" />

          <filter-select-categories v-model="selectedCategories" />

          <filter-checkbox-surfaces
            v-model="selectedSurfaces"
            v-model:environment="selectedEnvironments"
          />

          <filter-select-venues v-model="selectedVenues" />

          <filter-select-countries v-model="selectedCountries" />

          <filter-select-supervisors v-model="selectedSupervisors" />

          <filter-select-umpires v-model="selectedUmpires" />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div class="font-semibold">{{ data.count }} events</div>
          <u-command-palette
            v-if="data.count"
            placeholder="Search events on this page"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-150' }"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Results Archive">
        <template
          #links
          v-if="mdAndDown"
        >
          <u-slideover
            title="Filters"
            class="ml-auto"
          >
            <u-button :icon="ICONS.filter" />

            <template #body>
              <filter-date-picker v-model="dateRange" />

              <filter-checkbox-levels v-model="selectedLevels" />

              <filter-checkbox-tours v-model="selectedTours" />

              <filter-select-categories v-model="selectedCategories" />

              <filter-checkbox-surfaces
                v-model="selectedSurfaces"
                v-model:environment="selectedEnvironments"
              />

              <filter-select-venues v-model="selectedVenues" />

              <filter-select-countries v-model="selectedCountries" />

              <filter-select-supervisors v-model="selectedSupervisors" />

              <filter-select-umpires v-model="selectedUmpires" />
            </template>
          </u-slideover>
          <u-button
            :icon="ICONS.noFilter"
            @click="resetFilters"
          />
          <u-popover>
            <u-button :icon="ICONS.toc" />
            <template #content>
              <u-command-palette
                v-if="data.count"
                placeholder="Search events"
                :groups="toc"
                :loading="status === 'pending'"
                :fuse="{ resultLimit: 200 }"
                :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
              />
            </template>
          </u-popover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-pagination
          v-model:page="page"
          :total="data.count"
          :items-per-page="40"
          v-on:update:page="value => (skip = (value - 1) * 40)"
          active-variant="subtle"
          variant="ghost"
          :sibling-count="smAndDown ? 1 : undefined"
          :size="smAndDown ? 'xs' : 'md'"
          :show-edges="smAndDown ? false : true"
        />

        <u-page-list
          v-if="data.events.length || ['idle', 'pending'].includes(status)"
          class="max-h-150 p-5"
        >
          <event-card
            v-if="data.events.length"
            v-for="event in data.events"
            :key="event.id"
            :event
          />

          <loading-event
            v-else
            v-for="_ in 6"
            :key="_"
          />
        </u-page-list>
        <error-message
          v-else
          message="No events found"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
