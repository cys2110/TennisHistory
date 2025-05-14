<script setup lang="ts">
defineProps<{ stats: PlayerStatsType[]; status: APIStatusType; years: string[] | undefined }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid v-if="stats.length || ['pending', 'idle'].includes(status)">
    <u-page-card
      v-if="stats.length"
      v-for="stat in stats"
      :key="stat.category"
      :title="`${stat.value}${stat.suffix === false ? '' : '%'}`"
      :description="stat.category"
      highlight
      :ui="{ title: 'text-center', body: 'w-full', description: 'text-center' }"
    />
    <!--Loading state-->
    <base-loading-card
      v-else
      v-for="_ in 5"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noChart"
    :message="`No stats available for ${name}`"
  />
</template>
