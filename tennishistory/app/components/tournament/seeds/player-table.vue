<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

defineProps<{
  teams: TournamentSeedType["teams"]
}>()

const columns: TableColumn<TournamentSeedType["teams"][number]>[] = [
  { accessorKey: "seed", header: "Seed" },
  { id: "players", header: "Players(s)" }
]
</script>

<template>
  <u-table
    :data="teams"
    :columns="columns"
    class="w-fit mx-auto"
  >
    <template #players-cell="{ row }">
      <div class="flex flex-col items-center mx-10">
        <player-link
          v-for="player in row.original.players"
          :key="player.id"
          :player
        />
      </div>
    </template>
  </u-table>
</template>
