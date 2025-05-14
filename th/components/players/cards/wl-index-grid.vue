<script setup lang="ts">
const { index, status } = defineProps<{
  index: WLIndexInterface[]
  status: APIStatusType
}>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const categoryColours = {
  "Match Record": "ring-sky-700 dark:ring-sky-300",
  "Pressure Points": "ring-fuchsia-700 dark:ring-fuchsia-300",
  Environment: "ring-violet-700 dark:ring-violet-400",
  Other: "ring-emerald-700 dark:ring-emerald-300"
}

const formattedIndex = computed(() => {
  if (index.length) {
    return Object.values(
      index.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            category: item.category,
            stats: []
          }
        }
        acc[item.category].stats.push(item)
        return acc
      }, {} as Record<string, { category: string; stats: WLIndexInterface[] }>)
    )
  }
  return []
})
</script>

<template>
  <dashboard-subpanel
    v-if="index.length || ['pending', 'idle'].includes(status)"
    v-for="category in formattedIndex"
    :title="category.category"
    :key="category.category"
  >
    <u-page-grid>
      <u-page-card
        v-if="index.length"
        v-for="stat in category.stats"
        :key="stat.stat"
        :title="stat.stat"
        :ui="{
        body: 'w-full',
        root: `${categoryColours[stat.category as keyof typeof categoryColours]} shadow-none hover:shadow-none`
      }"
        highlight
      >
        <template #description>
          <div class="flex justify-between">
            <span>Win-Loss</span>
            <span>{{ stat.wins }}—{{ stat.losses }}</span>
          </div>
          <div
            v-if="stat.titles"
            class="flex justify-between"
          >
            <span>Titles</span>
            <span>{{ stat.titles }}</span>
          </div>
          <div class="flex justify-between">
            <span>Index</span>
            <span>{{ stat.value }}</span>
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
    :message="`No win-loss index available for ${name}`"
  />
</template>
