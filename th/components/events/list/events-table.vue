<script setup lang="ts">
import { BaseLink, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { events, count, status } = defineProps<{
  events: EventCardType[]
  status: APIStatusType
  value: string
  count: number
}>()

const appConfig = useAppConfig()
const route = useRoute()
const skip = defineModel<number>({ default: 0 })
const tournamentSort = defineModel<"ASC" | "DESC" | undefined>("tournament-sort", { default: undefined })
const categorySort = defineModel<"ASC" | "DESC" | undefined>("category-sort", { default: undefined })
const dateSort = defineModel<"ASC" | "DESC" | undefined>("date-sort", { default: "ASC" })
const surfaceSort = defineModel<"ASC" | "DESC" | undefined>("surface-sort", { default: undefined })

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(async () => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && events.length < count
    }
  )
})

const columns: TableColumn<EventCardType>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        size: "sm",
        class: "w-fit",
        icon: appConfig.ui.icons.chevronDown,
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: "tournament.name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Tournament",
        icon: tournamentSort.value ? (tournamentSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          dateSort.value = undefined
          surfaceSort.value = undefined
          categorySort.value = undefined
          tournamentSort.value = tournamentSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      const tournament = row.original.tournament
      return h(BaseLink, {
        type: "tournament",
        tournament,
        class: "md:text-xs lg:text-sm"
      })
    },
    meta: { class: { td: "max-w-20 xl:max-w-fit whitespace-normal break-words" } }
  },
  {
    accessorKey: "category",
    header: () => {
      if (route.name !== "category") {
        return h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Category",
          icon: categorySort.value ? (categorySort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
          onClick: () => {
            dateSort.value = undefined
            surfaceSort.value = undefined
            tournamentSort.value = undefined
            categorySort.value = categorySort.value === "ASC" ? "DESC" : "ASC"
          },
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
      } else {
        return "Category"
      }
    },
    cell: ({ row }) => {
      if (route.name !== "category") {
        return h(BaseLink, {
          id: row.original.category as string,
          type: "category",
          class: "md:text-xs lg:text-sm"
        })
      } else {
        return row.getValue("category")
      }
    },
    meta: { class: { td: "md:text-xs lg:text-sm" } }
  },
  {
    accessorKey: "dates",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Dates",
        icon: dateSort.value ? (dateSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          tournamentSort.value = undefined
          surfaceSort.value = undefined
          categorySort.value = undefined
          dateSort.value = dateSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    meta: { class: { td: "md:text-xs lg:text-sm" } }
  },
  {
    id: "surface",
    header: () => {
      if (route.name !== "surface") {
        return h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Surface",
          icon: surfaceSort.value ? (surfaceSort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
          onClick: () => {
            tournamentSort.value = undefined
            dateSort.value = undefined
            categorySort.value = undefined
            surfaceSort.value = surfaceSort.value === "ASC" ? "DESC" : "ASC"
          },
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
      } else {
        return "Surface"
      }
    },
    cell: ({ row }) => {
      if (route.name !== "surface") {
        return h(BaseLink, {
          id: row.original.surface.id,
          type: "surface"
        })
      } else {
        return row.original.surface.id
      }
    },
    meta: { class: { td: "md:text-xs lg:text-sm" } }
  },
  {
    accessorKey: "venues",
    header: "Country",
    cell: ({ row }) => {
      const venues = row.original.venues
      return h(BaseLink, { country: venues[0].country, type: "country", class: "mx-auto" })
    }
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="events"
    :columns
    class="max-h-200 mx-5"
    :loading="['pending', 'idle'].includes(status)"
    sticky
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton
          v-for="_ in 5"
          :key="_"
          class="h-4 rounded-lg"
        />
      </div>
    </template>
    <template #empty>
      {{
        route?.name === "surface"
          ? `No events found on ${value}`
          : route?.name === "supervisor"
          ? `No events supervised by ${value}`
          : route?.name === "upcoming-tournaments"
          ? "No upcoming tournaments"
          : route?.name === "archive-results"
          ? `No tournaments in ${value}`
          : route?.name === "venue"
          ? `No events took place at ${value}`
          : "No events found"
      }}
    </template>
    <template #expanded="{ row }">
      <div class="w-full flex flex-row-reverse justify-between gap-4 items-center">
        <div class="flex flex-col gap-1 items-end">
          <u-badge
            v-for="venue in row.original.venues"
            :key="venue.id"
            variant="outline"
            class="w-fit"
          >
            <base-link
              v-if="route.name !== 'venue'"
              type="venue"
              :id="venue.id"
              class="text-primary-600 dark:text-primary-300 hover:text-primary-500 dark:hover:text-primary-400 after:!bg-primary-500 after:dark:!bg-primary-400"
            >
              {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
            </base-link>
            <template v-else>{{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}</template>
          </u-badge>
        </div>
        <u-badge
          v-if="row.original.name"
          variant="outline"
        >
          {{ row.original.name }}
        </u-badge>
        <event-buttons
          :tournament="row.original.tournament"
          :year="row.original.year"
          :id="row.original.id"
          :draw_type="row.original.draw_type"
          :start_date="row.original.start_date"
        />
      </div>
    </template>
  </u-table>
</template>
