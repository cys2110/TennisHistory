<script setup lang="ts">
import { UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { events, status, value } = defineProps<{
  events: EventInterface[]
  status: APIStatusType
  value?: string
}>()
const {
  ui: { icons: appIcons }
} = useAppConfig()
const { name, query } = useRoute()

const columns: TableColumn<EventInterface>[] = [
  {
    id: "tournament",
    footer: () => {
      return "Total: " + events.length
    }
  },
  {
    id: "category",
    accessorFn: row => {
      const { category, atp_category, wta_category, men_category, women_category } = row
      const categories = [category, atp_category, wta_category, men_category, women_category].filter(Boolean)
      return categories.length > 1 ? categories.sort((a, b) => a!.localeCompare(b!))[0] : categories[0]
    },
    sortUndefined: "last",
    footer: () => {
      const tourLevel = events.reduce((acc, event) => {
        if (event.category || (event.atp_category && !ATP_CHALLENGER_CATEGORIES.includes(event.atp_category))) acc++
        return acc
      }, 0)
      const challengerLevel = events.reduce((acc, event) => {
        if (event.atp_category && ATP_CHALLENGER_CATEGORIES.includes(event.atp_category)) acc++
        return acc
      }, 0)
      return `ATP: ${tourLevel + challengerLevel} (Tour: ${tourLevel}, Challenger: ${challengerLevel})`
    }
  },
  {
    id: "dates",
    accessorFn: row => {
      const { start_date, atp_start_date, wta_start_date, men_start_date, women_start_date } = row
      const dates = [start_date, atp_start_date, wta_start_date, men_start_date, women_start_date].filter(Boolean)
      for (const date of dates) {
        return `${date!.year}-${date!.month}-${date!.day}`
      }
      return dates[0]
    },
    footer: () => {
      const tourLevel = events.reduce((acc, event) => {
        if (event.category || (event.wta_category && !WTA_CHALLENGER_CATEGORIES.includes(event.wta_category))) acc++
        return acc
      }, 0)
      const challengerLevel = events.reduce((acc, event) => {
        if (event.wta_category && WTA_CHALLENGER_CATEGORIES.includes(event.wta_category)) acc++
        return acc
      }, 0)
      return `WTA: ${tourLevel + challengerLevel} (Tour: ${tourLevel}, Challenger: ${challengerLevel})`
    }
  },
  { id: "environment", accessorFn: row => row.surface?.environment, sortUndefined: "last" },
  {
    id: "surface",
    accessorFn: row => row.surface?.surface,
    sortUndefined: "last",
    footer: () => {
      return (
        "ITF (M): " +
        events.reduce((acc, event) => {
          if (event.tours.includes("Men")) acc++
          return acc
        }, 0)
      )
    }
  },
  {
    id: "venue",
    accessorFn: row => row.venues?.[0]?.country.name,
    sortUndefined: "last",
    footer: () => {
      return (
        "ITF (W): " +
        events.reduce((acc, event) => {
          if (event.tours.includes("Women")) acc++
          return acc
        }, 0)
      )
    }
  },
  { id: "navigation" }
]

const message = computed(() => {
  switch (name) {
    case "category":
      return `No events of category ${value} found`
    case "venue":
      return `No events have taken place at ${value}`
    case "supervisor":
      return `No events supervised by ${value}`
    case "surface":
      return `No events have taken place on ${value}`
    case "upcoming-tournaments":
      return "No upcoming tournaments"
    case "results-archive":
      return `No events took place in ${query.year}`
    default:
      return "No events found"
  }
})

const tours = ["atp", "wta", "men", "women"]

const getCategoryKeys = (row: EventInterface) => tours.filter(tour => row[`${tour}_category` as keyof EventInterface])

const getDateKeys = (row: EventInterface) => tours.filter(tour => row[`${tour}_start_date` as keyof EventInterface])
</script>

<template>
  <u-table
    :data="events"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="message"
  >
    <template #tournament-header="{ column }">
      <sort-table-header
        :column
        label="Tournament"
        type="alpha"
      />
    </template>

    <template #tournament-cell="{ row }">
      <div>
        <u-link
          class="hover-link font-semibold"
          :to="{ name: 'tournament', params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) } }"
        >
          {{ row.original.tournament.name }}
        </u-link>
      </div>
      <div v-if="row.original.sponsor_name">
        {{ row.original.sponsor_name }}
      </div>
    </template>

    <template #category-header="{ column }">
      <sort-table-header
        :column="column"
        label="Category"
        type="alpha"
      />
    </template>

    <template #category-cell="{ row }">
      <u-link
        v-if="row.original.category"
        :to="{ name: 'category', params: { id: kebabCase(row.original.category) } }"
        class="hover-link"
      >
        {{ row.original.category }}
      </u-link>
      <div
        v-else-if="getCategoryKeys(row.original).length > 0"
        class="flex items-center gap-1 justify-center"
      >
        <template
          v-for="(tour, index) in getCategoryKeys(row.original)"
          :key="tour"
        >
          <u-separator
            v-if="index > 0"
            class="h-4"
            orientation="vertical"
          />
          <u-link
            :to="{ name: 'category', params: { id: kebabCase(row.original[`${tour}_category` as keyof EventInterface]! as string) } }"
            :class="`${tour}-link`"
          >
            {{ row.original[`${tour}_category` as keyof EventInterface] }}
          </u-link>
        </template>
      </div>
      <template v-else>—</template>
    </template>

    <template #dates-header="{ column }">
      <sort-table-header
        :column="column"
        label="Dates"
        type="number"
      />
    </template>

    <template #dates-cell="{ row }">
      <template v-if="row.original.start_date && row.original.end_date">
        {{ dateTimeFormat.formatRange(getDate(row.original.start_date), getDate(row.original.end_date)) }}
      </template>
      <div v-else>
        <div
          v-for="tour in getDateKeys(row.original)"
          :key="`date-${tour}`"
          :class="`text-${tour}`"
        >
          {{
            dateTimeFormat.formatRange(
              getDate(row.original[`${tour}_start_date` as keyof EventInterface] as DateType),
              getDate(row.original[`${tour}_end_date` as keyof EventInterface] as DateType)
            )
          }}
        </div>
      </div>
    </template>

    <template #environment-header="{ column }">
      <sort-table-header
        :column="column"
        label="Environment"
        type="alpha"
      />
    </template>

    <template #surface-header="{ column }">
      <sort-table-header
        :column="column"
        label="Surface"
        type="alpha"
      />
    </template>

    <template #surface-cell="{ row }">
      <u-link
        v-if="row.original.surface"
        :to="{ name: 'surface', params: { id: kebabCase(row.original.surface.id) } }"
        class="hover-link"
      >
        {{ row.original.surface.surface }}
      </u-link>
      <template v-else>Various</template>
    </template>

    <template #venue-header="{ column }">
      <sort-table-header
        :column="column"
        label="Venues"
        type="alpha"
      />
    </template>

    <template #venue-cell="{ row }">
      <div
        v-if="row.original.venues.length"
        class="flex flex-col items-center justify-center"
      >
        <div class="flex flex-wrap items-center gap-1">
          <span
            v-for="(venue, index) in useArrayUnique(row.original.venues.map(v => v.city)).value"
            :key="venue"
            class="flex flex-wrap items-center gap-1"
          >
            <u-separator
              v-if="index > 0"
              class="h-4"
              orientation="vertical"
            />
            {{ venue }}
          </span>
        </div>
        <country-link
          v-if="row.original.venues?.[0]?.country"
          :country="row.original.venues?.[0]?.country"
        />
      </div>
      <template v-else>Various</template>
    </template>

    <template #navigation-cell="{ row }">
      <u-dropdown-menu
        :items="
          EVENT_PAGES.map(item => ({
            ...item,
            to: {
              name: item.name,
              params: {
                id: row.original.tournament.id,
                name: kebabCase(row.original.tournament.name),
                year: row.original.year,
                eid: row.original.id
              }
            }
          }))
        "
        size="sm"
      >
        <u-button
          variant="ghost"
          :icon="appIcons.ellipsis"
          :ui="{ leadingIcon: 'rotate-90' }"
        />
      </u-dropdown-menu>
    </template>
  </u-table>
</template>
