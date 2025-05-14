<script setup lang="ts">
import { PlayerAvatar } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{
  players: (Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "ch" | "ch_date" | "dob"> & {
    coach_start: string | null
    coach_end: string | null
    gs: Pick<EventInterface, "year" | "id" | "tournament">[]
  })[]
  status: APIStatusType
  name: string
}>()

const columns: TableColumn<
  Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "ch" | "ch_date" | "dob"> & {
    coach_start: string | null
    coach_end: string | null
    gs: Pick<EventInterface, "year" | "id" | "tournament">[]
  }
>[] = [
  {
    id: "player",
    header: "Player",
    cell: ({ row }) =>
      h(PlayerAvatar, {
        player: row.original,
        class: "mx-auto w-fit"
      })
  },
  {
    id: "active",
    header: "Active Years",
    cell: ({ row }) => `${row.original.min_year} - ${row.original.max_year === new Date().getFullYear() ? "present" : row.original.max_year}`
  },
  {
    id: "ch",
    header: "Career High",
    cell: ({ row }) => {
      if (row.original.ch) {
        return h("div", { class: "flex flex-col justify-center gap-1" }, [
          h("span", {}, [row.original.ch]),
          h("span", { class: "text-sm" }, [row.original.ch_date])
        ])
      }
    }
  },
  {
    accessorKey: "coach_start",
    header: "Coach Start"
  },
  {
    accessorKey: "coach_end",
    header: "Coach End"
  },
  {
    id: "gs",
    header: "Grand Slam Titles"
  }
]
</script>

<template>
  <u-table
    ref="table"
    :data="players"
    :columns
    class="max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    sticky
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No players coached by {{ name }} </template>

    <template #gs-cell="{ row }">
      <div class="font-semibold flex flex-col gap-2">
        <div
          v-for="event in row.original.gs"
          :key="event.id"
          class="flex gap-2 justify-center"
        >
          <base-link
            type="tournament"
            :tournament="event.tournament"
          />
          <u-link
            :to="{ name: 'event', params: { id: event.tournament.id, name: encodeName(event.tournament.name), year: event.year, eid: event.id } }"
            class="hover-link"
          >
            {{ event.year }}
          </u-link>
        </div>
      </div>
    </template>
  </u-table>
</template>
