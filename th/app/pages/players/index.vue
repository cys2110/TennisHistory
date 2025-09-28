<script setup lang="ts">
import type { ContextMenuItem, TableColumn, TableRow } from "@nuxt/ui"

useHead({ title: "Players" })
const {
  ui: { icons }
} = useAppConfig()
const currentYear = new Date().getFullYear()

const skip = ref(0)
const players = ref<PlayerInterface[]>([])

// Filters
const selectedPlayers = ref<string[]>([])
const selectedTour = ref<TourType | undefined>()
const selectedCountries = ref<string[]>([])
const selectedMinYear = ref<number | undefined>()
const selectedMaxYear = ref<number | undefined>()
const selectedStatus = ref<string | undefined>()
const selectedCoaches = ref<string[]>([])
const resetFilters = () => {
  set(selectedPlayers, [])
  set(selectedTour, undefined)
  set(selectedCountries, [])
  set(selectedMinYear, undefined)
  set(selectedMaxYear, undefined)
  set(selectedStatus, undefined)
  set(selectedCoaches, [])
}

// Sorting
const playerSort = ref<SortType>()
const firstYearSort = ref<SortType>()
const lastYearSort = ref<SortType>()
const resetSorting = () => {
  set(playerSort, undefined)
  set(firstYearSort, undefined)
  set(lastYearSort, undefined)
}

const reset = () => {
  set(skip, 0)
  set(players, [])
}

watch(
  [
    selectedPlayers,
    selectedTour,
    selectedCountries,
    selectedMinYear,
    selectedMaxYear,
    selectedStatus,
    selectedCoaches,
    playerSort,
    firstYearSort,
    lastYearSort
  ],
  reset
)

interface DropdownOptionsInterface {
  players: PersonInterface[]
  countries: CountryInterface[]
  coaches: PersonInterface[]
}

// API calls
const { data: dropdownOptions, status: dropdownStatus } = await useFetch<DropdownOptionsInterface>("/api/players/dropdowns", {
  key: "players-dropdowns",
  default: () => ({
    players: [],
    countries: [],
    coaches: []
  }),
  server: false
})

const { data, status, execute } = await useFetch<{ count: number; players: PlayerInterface[] }>("/api/players", {
  key: `players-${skip}-${selectedTour}-${selectedCountries}-${selectedPlayers}-${selectedMinYear}-${selectedMaxYear}-${selectedStatus}-${selectedCoaches}-${playerSort}-${firstYearSort}-${lastYearSort}`,
  query: {
    skip,
    tour: selectedTour,
    countries: selectedCountries,
    players: selectedPlayers,
    minYear: selectedMinYear,
    maxYear: selectedMaxYear,
    status: selectedStatus,
    coaches: selectedCoaches,
    playerSort,
    firstYearSort,
    lastYearSort
  },
  default: () => ({ count: 0, players: [] }),
  onResponse: ({ response }) => {
    set(players, [...get(players), ...(response._data?.players || [])])
  },
  lazy: true,
  immediate: false
})

execute()

const table = useTemplateRef("table")

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
        return status.value !== "pending" && (data.value?.count ?? 0) > players.value.length
      }
    }
  )
})

const columns: TableColumn<PlayerInterface>[] = [
  { accessorKey: "tour" },
  {
    id: "status",
    accessorFn: row => (row.max_year === currentYear ? "Active" : "Inactive")
  },
  { accessorKey: "country" },
  { id: "name", accessorFn: row => `${row.first_name} ${row.last_name}` },
  { accessorKey: "min_year" },
  { accessorKey: "max_year" },
  { accessorKey: "coaches" }
]

const handleSelectRow = async (row: TableRow<PlayerInterface>) => {
  await navigateTo({
    name: "player",
    params: {
      id: row.original.id,
      name: kebabCase(`${row.original.first_name} ${row.original.last_name}`)
    }
  })
}

const contextMenuItems = ref<ContextMenuItem[]>([])

const onContextMenu = (_e: Event, row: TableRow<PlayerInterface>) => {
  const filters = [
    { label: "Tour", key: "tour", filter: selectedTour, icon: ICONS.tour },
    { label: "Status", key: "status", filter: selectedStatus, icon: ICONS.hybrid },
    { label: "Country", key: "country", filter: selectedCountries, icon: ICONS.countries },
    { label: "Player", key: "name", filter: selectedPlayers, icon: ICONS.player },
    { label: "Min Year", key: "min_year", filter: selectedMinYear, icon: ICONS.year },
    { label: "Max Year", key: "max_year", filter: selectedMaxYear, icon: ICONS.year },
    { label: "Coach", key: "coaches", filter: selectedCoaches, icon: ICONS.coach }
  ]

  const items: ContextMenuItem[] = [
    { type: "label" as const, label: "Go to..." },
    {
      type: "link" as const,
      icon: ICONS.player,
      label: row.getValue("name"),
      to: {
        name: "player",
        params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) }
      }
    },
    { type: "separator" as const },
    { type: "label" as const, label: "Filter by..." }
  ]

  for (const filter of filters) {
    const values =
      filter.label === "Coach"
        ? row.original.coaches || []
        : filter.label === "Country"
        ? [row.original.country]
        : filter.label === "Player"
        ? [{ id: row.original.id, name: `${row.original.first_name} ${row.original.last_name}` }]
        : ["Min Year", "Max Year"].includes(filter.label)
        ? [(row.getValue(filter.key) as number).toString()]
        : [row.getValue(filter.key)]

    if (values.length) {
      items.push({
        label: filter.label,
        icon: filter.icon,
        children: values.map((value: any) => ({
          type: "checkbox" as const,
          label: ["Country", "Player", "Coach"].includes(filter.label) ? value.name : value,
          icon: filter.label === "Country" ? getFlagCode(value) : undefined,
          checked: ["Country", "Player", "Coach"].includes(filter.label)
            ? get(filter.filter as Ref<string[]>).includes(value.id)
            : ["Min Year", "Max Year"].includes(filter.label)
            ? get(filter.filter as Ref<number>) === Number(value)
            : get(filter.filter as Ref<any>) === value,
          onUpdateChecked: (checked: boolean) => {
            if (checked) {
              filter.filter.value = ["Country", "Player", "Coach"].includes(filter.label)
                ? [...get(filter.filter as Ref<string[]>), value.id]
                : ["Min Year", "Max Year"].includes(filter.label)
                ? Number(value)
                : value
            } else {
              filter.filter.value = ["Country", "Player", "Coach"].includes(filter.label)
                ? get(filter.filter as Ref<string[]>).filter(v => v !== value.id)
                : undefined
            }
          }
        }))
      })
    }
  }

  contextMenuItems.value = items
}
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
            :data="players"
            :columns
            :loading="['idle', 'pending'].includes(status)"
            sticky
            @select="handleSelectRow"
            @contextmenu="onContextMenu"
            :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
          >
            <template #loading>
              <table-loading-icon />
            </template>
            <template #empty>
              <table-empty-message
                :icon="ICONS.noPlayer"
                message="No players found"
              />
            </template>
            <template #tour-header>
              <u-select-menu
                v-model="selectedTour"
                :items="['ATP', 'WTA']"
                :icon="ICONS.tour"
                placeholder="Tour"
                class="w-fit max-w-50"
              />
            </template>
            <template #tour-cell="{ row }">
              <coloured-badge
                :label="row.original.tour"
                class="mx-auto"
              />
            </template>
            <template #status-header>
              <u-select-menu
                v-model="selectedStatus"
                :items="['Active', 'Inactive']"
                :icon="ICONS.tour"
                placeholder="Status"
                class="w-fit max-w-50"
              />
            </template>
            <template #status-cell="{ row }">
              <coloured-badge
                :label="row.getValue('status') as string"
                class="mx-auto"
              />
            </template>
            <template #country-header>
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
            <template #country-cell="{ row }">
              <country-link
                :country="row.original.country"
                icon-only
                class="mx-auto"
              />
            </template>
            <template #name-header>
              <u-select-menu
                v-model="selectedPlayers"
                :icon="ICONS.player"
                :items="dropdownOptions.players.map(p => ({ ...p, name: `${p.first_name} ${p.last_name}` }))"
                label-key="name"
                value-key="id"
                multiple
                placeholder="Player"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
                class="w-fit max-w-50"
              >
                <template #content-bottom>
                  <u-button
                    :trailing-icon="icons.close"
                    color="neutral"
                    variant="link"
                    size="xs"
                    @click="selectedPlayers = []"
                    label="Clear"
                    block
                    class="border-t rounded-t-none border-muted"
                  />
                </template>
              </u-select-menu>
            </template>
            <template #min_year-header>
              <u-form-field label="Year of First Tournament">
                <u-input-number
                  v-model="selectedMinYear"
                  orientation="vertical"
                  :min="1968"
                  :max="currentYear"
                  :placeholder="`Min: 1968-${currentYear}`"
                />
              </u-form-field>
            </template>
            <template #max_year-header>
              <u-form-field label="Year of Last Tournament">
                <u-input-number
                  v-model="selectedMaxYear"
                  orientation="vertical"
                  :min="1968"
                  :max="currentYear"
                  :placeholder="`Max: 1968-${currentYear}`"
                />
              </u-form-field>
            </template>
            <template #coaches-header>
              <u-select-menu
                v-model="selectedCoaches"
                :icon="ICONS.coach"
                :items="dropdownOptions.coaches.map(c => ({ ...c, name: `${c.first_name} ${c.last_name}` }))"
                label-key="name"
                value-key="id"
                multiple
                placeholder="Coach"
                :loading="['pending', 'idle'].includes(dropdownStatus)"
                class="w-fit max-w-50"
              >
                <template #content-bottom>
                  <u-button
                    :trailing-icon="icons.close"
                    color="neutral"
                    variant="link"
                    size="xs"
                    @click="selectedCoaches = []"
                    label="Clear"
                    block
                    class="border-t rounded-t-none border-muted"
                  />
                </template>
              </u-select-menu>
            </template>
            <template #coaches-cell="{ row }">
              <div
                v-for="coach in row.original.coaches"
                :key="coach.id"
                class="flex flex-col items-center gap-1"
              >
                <u-link
                  v-if="coach.labels.includes('Player')"
                  :to="{ name: 'player', params: { id: coach.id, name: kebabCase(`${coach.first_name} ${coach.last_name}`) } }"
                  class="hover-link default-link"
                >
                  {{ coach.first_name }} {{ coach.last_name }}
                  <span v-if="coach.start_year">
                    &nbsp;({{
                      coach.end_year
                        ? coach.start_year === coach.end_year
                          ? `${coach.start_year}`
                          : `${coach.start_year}-${coach.end_year}`
                        : `${coach.start_year}-present`
                    }})
                  </span>
                </u-link>
                <div v-else>
                  <span>{{ coach.first_name }} {{ coach.last_name }}</span>
                  <span v-if="coach.start_year">
                    &nbsp;({{
                      coach.end_year
                        ? coach.start_year === coach.end_year
                          ? `${coach.start_year}`
                          : `${coach.start_year}-${coach.end_year}`
                        : `${coach.start_year}-present`
                    }})
                  </span>
                </div>
              </div>
            </template>
          </u-table>
        </u-context-menu>
      </template>
    </u-dashboard-panel>
  </div>
</template>
