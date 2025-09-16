<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { match } = defineProps<{
  match: (MatchInterface & { tournament: string }) | undefined
  status: APIStatusType
}>()

const { params } = useRoute()
const { name, year, mid } = params as {
  name?: string
  year?: string
  mid?: string
}

const isBold = (row: MatchStatsInterface, player: string) => {
  const lowStats = ["Double faults", "Unforced errors"]
  switch (player) {
    case "p1":
      if (lowStats.includes(row.label)) {
        return row.p1_pc < row.p2_pc
      } else if (
        (row.label === "Break points saved" && (row.p1 as string).endsWith("/0") && !(row.p2 as string).endsWith("/0")) ||
        (row.label === "Break points converted" && !(row.p1 as string).endsWith("/0") && (row.p2 as string).endsWith("/0"))
      ) {
        return true
      } else if (
        (row.label === "Break points saved" && !(row.p1 as string).endsWith("/0") && (row.p2 as string).endsWith("/0")) ||
        (row.label === "Break points converted" && (row.p1 as string).endsWith("/0") && !(row.p2 as string).endsWith("/0"))
      ) {
        return false
      } else {
        return row.p1_pc > row.p2_pc
      }
    default:
      if (lowStats.includes(row.label)) {
        return row.p2_pc < row.p1_pc
      } else if (
        (row.label === "Break points saved" && !(row.p1 as string).endsWith("/0") && (row.p2 as string).endsWith("/0")) ||
        (row.label === "Break points converted" && (row.p1 as string).endsWith("/0") && !(row.p2 as string).endsWith("/0"))
      ) {
        return true
      } else if (
        (row.label === "Break points saved" && (row.p1 as string).endsWith("/0") && !(row.p2 as string).endsWith("/0")) ||
        (row.label === "Break points converted" && !(row.p1 as string).endsWith("/0") && (row.p2 as string).endsWith("/0"))
      ) {
        return false
      } else {
        return row.p2_pc > row.p1_pc
      }
  }
}

const columns: TableColumn<MatchStatsInterface>[] = [
  {
    accessorKey: "p1_pc",
    meta: { class: { td: "w-2/5" } }
  },
  {
    accessorKey: "label",
    header: "",
    meta: { class: { td: "w-1/5" } }
  },
  {
    accessorKey: "p2_pc",
    meta: { class: { td: "w-2/5" } }
  }
]
</script>

<template>
  <u-table
    :data="match?.match_stats"
    :columns
    sticky
    class="max-h-200 min-h-fit"
    :loading="status === 'pending'"
    :empty="`No match stats available for ${name} ${year} ${mid}`"
  >
    <template #label-cell="{ row }">
      <match-chart
        v-if="match && row.original.category !== 'Service Speed'"
        :category="row.original.category"
        :label="row.original.label"
        :p1="match.p1"
        :p2="match.p2"
        :stats="match.match_stats.filter(s => s.category === row.original.category)"
        :tournament="match?.tournament"
      />
      <match-service-speed
        v-else-if="match"
        :category="row.original.category"
        :label="row.original.label"
        :p1="match.p1"
        :p2="match.p2"
        :stats="match.match_stats.filter(s => s.category === row.original.category)"
        :tournament="match?.tournament"
      />
    </template>

    <template #p1_pc-header>
      <div class="flex items-center gap-2 justify-center">
        <template
          v-for="(player, index) in match?.p1 ?? []"
          :key="player.id"
        >
          <u-separator
            v-if="index > 0"
            orientation="vertical"
            class="h-4"
          />
          <player-link :player />
        </template>
      </div>
    </template>

    <template #p1_pc-cell="{ row }">
      <u-progress
        v-model="row.original.p1_pc"
        :max="100"
        inverted
        :ui="{
          base: 'bg-doubles-300 dark:bg-doubles-800',
          indicator: 'bg-doubles-600 dark:bg-doubles-500'
        }"
      >
        <template #status="{ percent }">
          <span :class="isBold(row.original, 'p1') ? 'font-semibold' : ''">
            {{
              ["Aces", "Double faults", "Service games", "Return games", "Winners", "Unforced errors"].includes(row.original.label) ? row.original.p1
              : row.original.label.includes("speed") ? `${row.original.p1}km/h (${Math.round(kmhToMph(row.original.p1))}mph)`
              : `${row.original.p1} (${percent}%)`
            }}
          </span>
        </template>
      </u-progress>
    </template>

    <template #p2_pc-header>
      <div class="flex items-center gap-2 justify-center">
        <template
          v-for="(player, index) in match?.p2 ?? []"
          :key="player.id"
        >
          <u-separator
            v-if="index > 0"
            orientation="vertical"
            class="h-4"
          />
          <player-link :player />
        </template>
      </div>
    </template>

    <template #p2_pc-cell="{ row }">
      <u-progress
        v-model="row.original.p2_pc"
        :max="100"
        :ui="{
          base: 'bg-fuchsia-300 dark:bg-fuchsia-800',
          indicator: 'bg-fuchsia-600 dark:bg-fuchsia-500'
        }"
      >
        <template #status="{ percent }">
          <span :class="isBold(row.original, 'p2') ? 'font-semibold' : ''">
            {{
              ["Aces", "Double faults", "Service games", "Return games", "Winners", "Unforced errors"].includes(row.original.label) ? row.original.p2
              : row.original.label.includes("speed") ? `${row.original.p2}km/h (${Math.round(kmhToMph(row.original.p2))}mph)`
              : `${row.original.p2} (${percent}%)`
            }}
          </span>
        </template>
      </u-progress>
    </template>
  </u-table>
</template>
