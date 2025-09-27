<script setup lang="ts">
import type { ContextMenuItem, TableColumn, TableRow } from "@nuxt/ui"
import type { RouteLocationRaw } from "vue-router"
import { CalendarDate } from "@internationalized/date"

useHead({ title: "Results Archive" })
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const lgAndUp = breakpoints.greaterOrEqual("lg")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()

const skip = ref(0)
const events = ref<EventInterface[]>([])

// Filters
const selectedTournaments = ref<string[]>([])
const selectedLevels = ref<LevelType[]>([])
const selectedCategories = ref<CategoryType[]>([])
const dateRange = shallowRef<{ start: CalendarDate | undefined; end: CalendarDate | undefined }>({
  start: undefined,
  end: undefined
})
const selectedSurfaces = ref<string[]>([])
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

// Sorting
const tournamentSort = ref<SortType>()
const dateSort = ref<SortType>()
const resetSorting = () => {
  set(tournamentSort, undefined)
  set(dateSort, undefined)
}

const reset = () => {
  set(skip, 0)
  set(events, [])
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
    tournamentSort,
    dateSort
  ],
  reset
)

interface DropdownOptionsInterface {
  tournaments: string[]
  categories: CategoryType[]
  venues: VenueInterface[]
  countries: CountryInterface[]
  supervisors: PersonInterface[]
  umpires: PersonInterface[]
}

// API calls
const { data: dropdownOptions, status: dropdownStatus } = await useFetch<DropdownOptionsInterface>("/api/archive/dropdowns", {
  key: "archive-dropdowns",
  default: () => ({
    tournaments: [],
    categories: [],
    venues: [],
    countries: [],
    supervisors: [],
    umpires: []
  }),
  server: false
})

const { data, status, execute } = await useFetch<{ count: number; events: EventInterface[] }>("/api/archive", {
  key: `results-archive-${selectedTournaments}-${skip}-${selectedUmpires}-${selectedSupervisors}-${selectedSurfaces}-${selectedCategories}-${selectedVenues}-${selectedCountries}-${selectedLevels}-${dateRange}-${tournamentSort}-${dateSort}`,
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
    dateRange,
    tournamentSort,
    dateSort
  },
  default: () => ({ count: 0, events: [] }),
  onResponse: ({ response }) => {
    set(events, [...get(events), ...(response._data?.events || [])])
  },
  lazy: true,
  immediate: false
})

execute()

const table = useTemplateRef("table")
const columnPinning = ref({
  left: ["tournament"],
  right: []
})

onMounted(() => {
  useInfiniteScroll(
    // @ts-ignore
    table.value?.$el,
    () => {
      set(skip, get(skip) + 40)
    },
    {
      distance: 50,
      canLoadMore: () => {
        return status.value !== "pending" && (data.value?.count ?? 0) > events.value.length
      }
    }
  )
})

const columns = computed<TableColumn<EventInterface>[]>(() => [
  {
    id: "tournament",
    accessorKey: "tournament.name",
    meta: { class: { th: "z-40" } },
    footer: () => `${data.value.count} ${data.value.count === 1 ? "event" : "events"}`
  },
  { accessorKey: "levels" },
  { accessorKey: "categories" },
  { accessorKey: "dates" },
  { id: "surface", accessorKey: "surface.id" },
  { accessorKey: "venues" },
  { accessorKey: "countries" },
  { accessorKey: "supervisors" },
  { accessorKey: "umpires" }
])

const handleRowSelect = (row: TableRow<EventInterface>) => {
  toast.clear()
  toast.add({
    title: row.original.tournament.name,
    description: row.original.year.toString(),
    duration: Infinity,
    progress: false,
    actions: [
      {
        icon: ICONS.tournament,
        label: "Tournament",
        onClick: () => {
          toast.clear()
          navigateTo({
            name: "tournament",
            params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) }
          } as RouteLocationRaw)
        }
      },
      ...EVENT_PAGES.map(page => ({
        icon: page.icon,
        label: page.label,
        ui: { leadingIcon: page.icon === ICONS.draw ? "rotate-270" : undefined },
        onClick: () => {
          toast.clear()
          navigateTo({
            name: page.name,
            params: {
              id: row.original.tournament.id,
              name: kebabCase(row.original.tournament.name),
              year: row.original.year,
              eid: row.original.id
            }
          } as RouteLocationRaw)
        }
      }))
    ]
  })
}

const contextMenuItems = ref<ContextMenuItem[]>([])

const onContextMenu = (_e: Event, row: TableRow<EventInterface>) => {
  const filters: { label: string; key: keyof EventInterface; filter: Ref<string[]>; icon?: string }[] = [
    { label: "Tournament", key: "tournament", filter: selectedTournaments, icon: ICONS.tournament },
    { label: "Level", key: "levels", filter: selectedLevels, icon: ICONS.hybrid },
    { label: "Category", key: "categories", filter: selectedCategories, icon: ICONS.categories },
    { label: "Surface", key: "surface", filter: selectedSurfaces, icon: ICONS.court },
    { label: "Venue", key: "venues", filter: selectedVenues, icon: ICONS.venue },
    { label: "Country", key: "countries", filter: selectedCountries, icon: ICONS.countries },
    { label: "Supervisor", key: "supervisors", filter: selectedSupervisors, icon: ICONS.supervisor },
    { label: "Umpire", key: "umpires", filter: selectedUmpires, icon: ICONS.umpire }
  ]

  const items: ContextMenuItem[] = [
    { type: "label" as const, label: "Go to..." },
    {
      type: "link" as const,
      icon: ICONS.tournament,
      label: row.original.tournament.name,
      to: {
        name: "tournament",
        params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) }
      }
    },
    ...EVENT_PAGES.map(
      page =>
        ({
          type: "link" as const,
          label: page.label,
          icon: page.icon,
          ui: { itemLeadingIcon: page.icon === ICONS.draw ? "rotate-270" : undefined },
          to: {
            name: page.name,
            params: {
              id: row.original.tournament.id,
              name: kebabCase(row.original.tournament.name),
              year: row.original.year,
              eid: row.original.id
            }
          }
        } as ContextMenuItem)
    ),
    { type: "separator" as const },
    { type: "label" as const, label: "Filter by..." }
  ]

  for (const filter of filters) {
    const values =
      filter.label === "Tournament"
        ? [row.original.tournament.name]
        : filter.label === "Surface" && row.original.surface
        ? [row.original.surface.id]
        : (row.original[filter.key] as any).filter(Boolean)

    if (values.length) {
      items.push({
        label: filter.label,
        icon: filter.icon,
        children: values.map((value: any) => ({
          type: "checkbox" as const,
          label:
            typeof value === "string"
              ? value
              : filter.label === "Country"
              ? value.name
              : filter.label === "Venue"
              ? value.name
                ? `${value.name}, ${value.city}`
                : value.city
              : value.id,
          icon: filter.label === "Country" ? getFlagCode(value) : undefined,
          checked: get(filter.filter).includes(typeof value === "string" ? value : value.id),
          onUpdateChecked: (checked: boolean) => {
            if (checked) {
              filter.filter.value = [...get(filter.filter), typeof value === "string" ? value : value.id]
            } else {
              filter.filter.value = get(filter.filter).filter(v => v !== (typeof value === "string" ? value : value.id))
            }
          }
        }))
      })
    }
  }

  contextMenuItems.value = items
}

onBeforeUnmount(() => toast.clear())
onBeforeRouteLeave(() => toast.clear())
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Reset Sorting"
            :icon="ICONS.sortAlpha"
            @click="resetSorting"
            size="sm"
          />
          <u-button
            label="Reset Filters"
            :icon="ICONS.noFilter"
            @click="resetFilters"
            size="sm"
          />
          <table-visibility
            v-if="table"
            :table="table!"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-context-menu :items="contextMenuItems">
          <u-table
            ref="table"
            :data="events"
            :columns
            :loading="['pending', 'idle'].includes(status)"
            sticky
            v-model:column-pinning="columnPinning"
            @select="handleRowSelect"
            @contextmenu="onContextMenu"
            render-fallback-value="Various"
            :ui="{ tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
          >
            <template #loading>
              <table-loading-icon />
            </template>
            <template #empty>
              <table-empty-message
                :icon="ICONS.noCalendar"
                message="No events found"
              />
            </template>
            <template #tournament-header>
              <table-header-server-sort
                label="Tournament"
                :items="dropdownOptions.tournaments"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
                v-model:filters="selectedTournaments"
                v-model:sort="tournamentSort"
              />
            </template>
            <template #tournament-cell="{ row }">
              <div class="flex flex-col items-center">
                <u-link
                  :to="{ name: 'tournament', params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) } }"
                  class="hover-link default-link font-semibold"
                >
                  {{ row.original.tournament.name }}
                </u-link>
                <div v-if="lgAndUp && row.original.sponsor_name">
                  {{ row.original.sponsor_name }}
                </div>
              </div>
            </template>
            <template #levels-header>
              <filter-select
                placeholder="Levels"
                :options="['Tour', 'Challenger', 'ITF']"
                v-model="selectedLevels"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
              />
            </template>
            <template #levels-cell="{ row }">
              <div class="flex flex-col items-center gap-1">
                <coloured-badge
                  v-for="level in row.original.levels"
                  :key="`${row.original.id}-${level}`"
                  :label="level"
                  class="mx-auto"
                />
              </div>
            </template>
            <template #categories-header>
              <filter-select
                placeholder="Categories"
                :options="dropdownOptions.categories"
                v-model="selectedCategories"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
              />
            </template>
            <template #categories-cell="{ row }">
              <template
                v-for="(category, index) in row.original.categories"
                :key="`${row.original.id}-category-${index}`"
              >
                <div
                  v-if="category"
                  :class="`text-${tourColourMapping[index]}`"
                >
                  {{ category }}
                </div>
              </template>
            </template>
            <template #dates-header>
              <filter-date
                v-model:date-range="dateRange"
                v-model:sort="dateSort"
              />
            </template>
            <template #dates-cell="{ row }">
              <template
                v-for="(date, index) in row.original.dates"
                :key="`${row.original.id}-date-${index}`"
              >
                <div
                  v-if="date[0] && date[1]"
                  :class="`text-${tourColourMapping[index]}`"
                >
                  {{
                    lgAndUp
                      ? dateTimeFormat.formatRange(getDate(date[0]), getDate(date[1]))
                      : shortDateFormat.formatRange(getDate(date[0]), getDate(date[1]))
                  }}
                </div>
              </template>
            </template>
            <template #surface-header>
              <filter-select
                placeholder="Surfaces"
                :options="SURFACES_LIST.map(s => s.id)"
                v-model="selectedSurfaces"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
              />
            </template>
            <template #venues-header>
              <u-select-menu
                v-model="selectedVenues"
                :icon="ICONS.venue"
                :items="dropdownOptions.venues.map(v => ({ id: v.id, label: v.name ? `${v.name}, ${v.city}` : v.city }))"
                label-key="label"
                value-key="id"
                multiple
                placeholder="Venues"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
                class="w-fit max-w-50"
              >
                <template #content-bottom>
                  <u-button
                    :trailing-icon="icons.close"
                    color="neutral"
                    variant="link"
                    size="xs"
                    @click="selectedVenues = []"
                    label="Clear"
                    block
                    class="border-t rounded-t-none border-muted"
                  />
                </template>
              </u-select-menu>
            </template>
            <template #venues-cell="{ row }">
              <div
                v-for="venue in row.original.venues"
                :key="`${row.original.id}-${venue.id}`"
              >
                {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
              </div>
            </template>
            <template #countries-header>
              <u-select-menu
                v-model="selectedCountries"
                :icon="ICONS.countries"
                :items="dropdownOptions.countries"
                label-key="name"
                value-key="id"
                multiple
                placeholder="Country"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
                class="w-fit max-w-50"
              >
                <template #content-bottom>
                  <u-button
                    :trailing-icon="icons.close"
                    color="neutral"
                    variant="link"
                    size="xs"
                    @click="selectedCountries = []"
                    label="Clear"
                    block
                    class="border-t rounded-t-none border-muted"
                  />
                </template>
              </u-select-menu>
            </template>
            <template #countries-cell="{ row }">
              <country-link
                v-for="country in row.original.countries"
                :key="`${row.original.id}-${country.id}`"
                :country="country"
                class="mx-auto"
                icon-only
              />
            </template>
            <template #supervisors-header>
              <filter-select
                placeholder="Supervisors"
                :options="dropdownOptions.supervisors.map(s => s.id)"
                v-model="selectedSupervisors"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
              />
            </template>
            <template #supervisors-cell="{ row }">
              <div
                v-for="supervisor in row.original.supervisors"
                :key="`${row.original.id}-${supervisor.id}`"
              >
                {{ supervisor.id }}
              </div>
            </template>
            <template #umpires-header>
              <filter-select
                placeholder="Umpires"
                :options="dropdownOptions.umpires.map(u => u.id)"
                v-model="selectedUmpires"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
              />
            </template>
            <template #umpires-cell="{ row }">
              <div
                v-for="umpire in row.original.umpires"
                :key="`${row.original.id}-${umpire.id}`"
              >
                {{ umpire.id }}
              </div>
            </template>
          </u-table>
        </u-context-menu>
      </template>
    </u-dashboard-panel>
  </div>
</template>
