<script setup lang="ts">
// @ts-ignore
import kmhToMph from "kmh-to-mph"

interface MatchStatsType {
  label: string
  p1: string
  p1_pc: number
  p2: string
  p2_pc: number
  category: string
}

const { stats, p1, p2 } = defineProps<{
  stats: MatchStatsType[]
  status: APIStatusType
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const categoryColours = {
  "Service Stats": "ring-sky-700 dark:ring-sky-300",
  "Return Stats": "ring-fuchsia-700 dark:ring-fuchsia-300",
  "Points Stats": "ring-violet-700 dark:ring-violet-400",
  "Service Speed": "ring-emerald-700 dark:ring-emerald-300"
}

const categories = computed(() => {
  const baseCategories = ["Service Stats", "Return Stats", "Points Stats"]
  if (stats.some(stat => stat.category === "Service Speed")) {
    baseCategories.push("Service Speed")
  }
  return baseCategories
})

const isBold = (stat: MatchStatsType, player: string, label: string) => {
  const lowStats = ["Double faults", "Unforced errors"]
  const bpsStats = ["Break points saved", "Break points converted"]
  switch (player) {
    case "p1":
      if (lowStats.includes(label)) {
        return stat.p1_pc < stat.p2_pc
      } else if (bpsStats.includes(label)) {
        if (stat.p1_pc === 0 && stat.p2_pc !== 0) {
          return true
        } else {
          return stat.p1_pc > stat.p2_pc
        }
      } else {
        return stat.p1_pc > stat.p2_pc
      }
    default:
      if (lowStats.includes(label)) {
        return stat.p2_pc < stat.p1_pc
      } else if (bpsStats.includes(label)) {
        if (stat.p2_pc === 0 && stat.p1_pc !== 0) {
          return true
        } else {
          return stat.p2_pc > stat.p1_pc
        }
      } else {
        return stat.p2_pc > stat.p1_pc
      }
  }
}
</script>

<template>
  <dashboard-subpanel
    v-if="stats.length || ['pending', 'idle'].includes(status)"
    v-for="category in categories.filter(Boolean)"
    :title="category"
    :key="category"
  >
    <u-page-grid class="xl:grid-cols-3 2xl:grid-cols-4">
      <u-page-card
        v-if="stats.length"
        v-for="stat in stats.filter(s => s.category === category)"
        :key="stat.label"
        :title="stat.label"
        :ui="{
        body: 'w-full',
        root: `${categoryColours[stat.category as keyof typeof categoryColours]} shadow-none hover:shadow-none`
      }"
        highlight
      >
        <template #description>
          <div class="flex justify-between items-center my-2">
            <player-avatar :player="p1" />
            <span
              v-if="stat.category === 'Service Speed'"
              :class="{ 'font-semibold': stat.p1 > stat.p2 }"
            >
              {{ stat.p1 }}km/h ({{ Math.round(kmhToMph(stat.p1)) }}mph)
            </span>
            <span
              v-else
              :class="{ 'font-semibold': isBold(stat, 'p1', stat.label) }"
            >
              {{ stat.p1 }} ({{ stat.p1_pc }}%)
            </span>
          </div>
          <div class="flex justify-between items-center my-2">
            <player-avatar :player="p2" />
            <span
              v-if="stat.category === 'Service Speed'"
              :class="{ 'font-semibold': stat.p2 > stat.p1 }"
            >
              {{ stat.p2 }}km/h ({{ Math.round(kmhToMph(stat.p2)) }}mph)
            </span>
            <span
              v-else
              :class="{ 'font-semibold': isBold(stat, 'p2', stat.label) }"
            >
              {{ stat.p2 }} ({{ stat.p2_pc }}%)
            </span>
          </div>
        </template>
      </u-page-card>

      <!--Loading state-->
      <base-loading-card
        v-else
        v-for="_ in 5"
        :key="_"
      />
    </u-page-grid>
  </dashboard-subpanel>
  <error-message
    v-else
    :icon="ICONS.noChart"
    :message="`No match stats available for ${name} ${route.params.year} ${route.params.mid}`"
  />
</template>
