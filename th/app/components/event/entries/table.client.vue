<script setup lang="ts">
import { UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
defineProps<{
  entries: ConsolidatedEntryType[]
  status: APIStatusType
  tournament: string
  viewType: boolean
}>()
const { params } = useRoute()
const { year } = params as { year: string }
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])

const getTypeColor = (type: string) => {
  switch (type) {
    case "Main Singles":
      return "singles"
    case "Qualifying Singles":
      return "active"
    case "Main Doubles":
      return "doubles"
    case "Qualifying Doubles":
      return "inactive"
    default:
      return "neutral"
  }
}

const columns: TableColumn<ConsolidatedEntryType>[] = [
  {
    accessorKey: "tour",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Tour",
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "type",
    header: ""
  },
  {
    id: "players",
    accessorFn: row => {
      const sortedPlayers = row.players.sort((a, b) => a.last_name.localeCompare(b.last_name))
      return sortedPlayers[0]?.last_name
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player(s)",
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    meta: { class: { th: "text-left" } }
  },
  {
    id: "seed",
    accessorFn: row => row.singles_seed ?? row.doubles_seed ?? row.singles_q_seed ?? row.doubles_q_seed,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    id: "status",
    accessorFn: row => row.singles_status ?? row.doubles_status ?? row.singles_q_status ?? row.doubles_q_status,
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Status",
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    id: "rank",
    accessorFn: row => {
      const rank = row.players.map(p => p.singles_rank ?? p.doubles_rank).sort((a, b) => (a ?? 9999) - (b ?? 9999))[0]
      return rank
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Rank",
        icon:
          isSorted ?
            isSorted === "asc" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    id: "withdrawn",
    header: "Withdrew"
  }
]
</script>

<template>
  <u-table
    :data="entries"
    :columns="tours.includes('ATP') && tours.includes('WTA') ? columns : columns.filter(c => c.id !== 'tour')"
    :loading="status === 'pending'"
    sticky
    :empty="`No entries found for ${tournament} ${year}`"
    class="my-auto"
    :ui="{
      root: 'max-h-200 max-w-full w-fit md:min-w-3/4 xl:min-w-2/3 mx-auto mt-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent'
    }"
  >
    <template #tour-cell="{ row }">
      <u-badge
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
    </template>

    <template #type-cell="{ row }">
      <div class="flex gap-2 w-fit mx-auto">
        <u-badge
          v-for="type in row.original.type"
          :key="type"
          :label="type"
          :color="getTypeColor(type)"
        />
      </div>
    </template>

    <template #players-cell="{ row }">
      <div class="flex gap-2">
        <template
          v-for="(player, index) in row.original.players"
          :key="player.id"
        >
          <u-separator
            v-if="index > 0"
            orientation="vertical"
            class="h-4"
          />
          <player-link :player="{ ...player, tour: row.original.tour }" />
        </template>
      </div>
    </template>

    <template #seed-cell="{ row }">
      <div class="flex gap-1 mx-auto w-fit">
        <u-badge
          v-if="row.original.singles_seed"
          :label="row.original.singles_seed"
          color="singles"
        />
        <u-badge
          v-if="row.original.doubles_seed"
          :label="row.original.doubles_seed"
          color="doubles"
        />
        <u-badge
          v-if="row.original.singles_q_seed"
          :label="row.original.singles_q_seed"
          color="active"
        />
        <u-badge
          v-if="row.original.doubles_q_seed"
          :label="row.original.doubles_q_seed"
          color="inactive"
        />
      </div>
    </template>

    <template #status-cell="{ row }">
      <div class="flex gap-1 w-fit mx-auto">
        <u-badge
          v-if="row.original.singles_status"
          :label="STATUSES[row.original.singles_status].longName"
          color="singles"
        />
        <u-badge
          v-if="row.original.doubles_status"
          :label="STATUSES[row.original.doubles_status].longName"
          color="doubles"
        />
        <u-badge
          v-if="row.original.singles_q_status"
          :label="STATUSES[row.original.singles_q_status].longName"
          color="active"
        />
        <u-badge
          v-if="row.original.doubles_q_status"
          :label="STATUSES[row.original.doubles_q_status].longName"
          color="inactive"
        />
      </div>
    </template>

    <template #rank-cell="{ row }">
      <div class="flex gap-1 w-fit mx-auto">
        <u-badge
          v-if="row.original.players[0].singles_rank"
          :label="row.original.players[0].singles_rank"
          color="singles"
        />
        <u-badge
          v-if="row.original.players[0].doubles_rank || row.original.players[1]?.doubles_rank"
          color="doubles"
        >
          {{ row.original.players[0].doubles_rank ?? 0 }}
          <u-separator
            v-if="viewType"
            orientation="vertical"
            class="h-4"
          />
          {{ row.original.players[1]?.doubles_rank ?? (viewType ? 0 : "") }}
        </u-badge>
      </div>
    </template>

    <template #withdrawn-cell="{ row }">
      <div class="flex items-center justify-center gap-2">
        <u-icon
          v-if="row.original.singles_withdrawn"
          :name="appIcons.error"
          class="text-xl"
          :class="row.original.type.includes('Main Singles') ? 'text-singles' : 'text-active'"
        />
        <u-icon
          v-if="row.original.doubles_withdrawn"
          :name="appIcons.error"
          class="text-xl"
          :class="row.original.type.includes('Main Doubles') ? 'text-doubles' : 'text-inactive'"
        />
      </div>
    </template>
  </u-table>
</template>
