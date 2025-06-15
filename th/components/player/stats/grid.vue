<script setup lang="ts">
defineProps<{ stats: PlayerStatsType[]; status: APIStatusType; years: string[] | undefined; tour: TourType }>()
const { icons } = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
</script>

<template>
  <u-page-grid v-if="stats.length || ['pending', 'idle'].includes(status)">
    <details-card
      v-if="stats.length"
      v-for="stat in stats"
      :key="stat.category"
      :detail="{ title: stat.category, value: `${stat.value}${stat.suffix === false ? '' : '%'}` }"
      :tour
    />
    <loading-base
      v-else
      v-for="_ in 5"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noChart"
    :message="`No stats available for ${name}`"
  />
</template>
