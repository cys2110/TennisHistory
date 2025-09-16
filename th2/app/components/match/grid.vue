<script setup lang="ts">
import { MatchChart, MatchServiceSpeed } from "#components"

const { stats, p1, p2 } = defineProps<{
  stats: MatchStatsType[]
  status: APIStatusType
  p1: PlayerInterface[] | undefined
  p2: PlayerInterface[] | undefined
}>()
const { icons } = useAppConfig()
const { params } = useRoute()
const { name, year, mid } = params as {
  name?: string
  year?: string
  mid?: string
}

const categoryColours = {
  "Service Stats": "ring-men-600 dark:ring-men-300",
  "Return Stats": "ring-women-600 dark:ring-women-300",
  "Points Stats": "ring-joint-600 dark:ring-joint-400",
  "Service Speed": "ring-active-600 dark:ring-active-300"
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
  switch (player) {
    case "p1":
      if (lowStats.includes(label)) {
        return stat.p1_pc < stat.p2_pc
      } else if (
        (label === "Break points saved" && stat.p1.endsWith("/0") && !stat.p2.endsWith("/0")) ||
        (label === "Break points converted" && !stat.p1.endsWith("/0") && stat.p2.endsWith("/0"))
      ) {
        return true
      } else if (
        (label === "Break points saved" && !stat.p1.endsWith("/0") && stat.p2.endsWith("/0")) ||
        (label === "Break points converted" && stat.p1.endsWith("/0") && !stat.p2.endsWith("/0"))
      ) {
        return false
      } else {
        return stat.p1_pc > stat.p2_pc
      }
    default:
      if (lowStats.includes(label)) {
        return stat.p2_pc < stat.p1_pc
      } else if (
        (label === "Break points saved" && !stat.p1.endsWith("/0") && stat.p2.endsWith("/0")) ||
        (label === "Break points converted" && stat.p1.endsWith("/0") && !stat.p2.endsWith("/0"))
      ) {
        return true
      } else if (
        (label === "Break points saved" && stat.p1.endsWith("/0") && !stat.p2.endsWith("/0")) ||
        (label === "Break points converted" && !stat.p1.endsWith("/0") && stat.p2.endsWith("/0"))
      ) {
        return false
      } else {
        return stat.p2_pc > stat.p1_pc
      }
  }
}
</script>

<template>
  <dashboard-subpanel
    v-if="stats.length"
    v-for="category in categories.filter(Boolean)"
    :title="category"
    :key="category"
  >
    <template #right>
      <component
        :is="category === 'Service Speed' ? MatchServiceSpeed : MatchChart"
        :category
        :p1
        :p2
        :stats="stats.filter(s => s.category === category)"
      />
    </template>
    <u-page-columns class="lg:columns-2 xl:columns-3 2xl:columns-4">
      <u-card
        v-if="stats.length"
        v-for="stat in stats.filter(s => s.category === category)"
        :key="stat.label"
        :ui="{
          root: categoryColours[stat.category as keyof typeof categoryColours],
          header: 'font-semibold',
          body: 'text-sm flex flex-col gap-2'
        }"
      >
        <template #header>
          {{ stat.label }}
        </template>
        <u-progress
          v-model="stat.p1_pc"
          :ui="{
            base: 'bg-doubles-300 dark:bg-doubles-800',
            indicator: 'bg-doubles-600 dark:bg-doubles-500',
            status: 'text-accented',
            root: 'gap-0'
          }"
        >
          <template #status="{ percent }">
            <div class="flex w-full justify-between items-center my-2">
              <div class="flex-1 flex flex-wrap items-center gap-2">
                <template
                  v-for="(player, index) in p1"
                  :key="player.id"
                >
                  <u-separator
                    v-if="index === 1"
                    orientation="vertical"
                    class="h-4"
                  />
                  <player-link :player="player" />
                </template>
              </div>
              <span
                v-if="stat.category === 'Service Speed'"
                class="text-right"
                :class="{ 'font-semibold': stat.p1 > stat.p2 }"
              >
                {{ stat.p1 }}km/h ({{ Math.round(kmhToMph(stat.p1)) }}mph)
              </span>
              <span
                v-else
                class="text-right"
                :class="{ 'font-semibold': isBold(stat, 'p1', stat.label) }"
              >
                {{ stat.p1 }} ({{ percent }}%)
              </span>
            </div>
          </template>
        </u-progress>
        <u-progress
          v-model="stat.p2_pc"
          :ui="{
            base: 'bg-wta-300 dark:bg-wta-800',
            indicator: 'bg-wta-600 dark:bg-wta-500',
            status: 'text-accented',
            root: 'gap-0'
          }"
        >
          <template #status="{ percent }">
            <div class="flex w-full justify-between items-center my-2">
              <div class="flex-1 flex flex-wrap items-center gap-2">
                <template
                  v-for="(player, index) in p2"
                  :key="player.id"
                >
                  <u-separator
                    v-if="index === 1"
                    orientation="vertical"
                    class="h-4"
                  />
                  <player-link :player="player" />
                </template>
              </div>
              <span
                v-if="stat.category === 'Service Speed'"
                class="text-right"
                :class="{ 'font-semibold': stat.p2 > stat.p1 }"
              >
                {{ stat.p2 }}km/h ({{ Math.round(kmhToMph(stat.p2)) }}mph)
              </span>
              <span
                v-else
                class="text-right"
                :class="{ 'font-semibold': isBold(stat, 'p2', stat.label) }"
              >
                {{ stat.p2 }} ({{ percent }}%)
              </span>
            </div>
          </template>
        </u-progress>
      </u-card>
    </u-page-columns>
  </dashboard-subpanel>
  <error-message
    v-else
    :icon="icons.noChart"
    :message="`No match stats available for ${name} ${year} ${mid}`"
  />
</template>
