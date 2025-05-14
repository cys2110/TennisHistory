<script setup lang="ts">
defineProps<{
  stats: { category: string; label: string; p1: string; p1_pc: number; p2: string; p2_pc: number }[]
}>()
const route = useRoute()
</script>

<template>
  <u-modal
    :title="`${route.params.name} ${route.params.year}`"
    description="Service Speed"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.gauge"
      size="xs"
    />

    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <service-speed-gauge
          v-for="stat in stats"
          :key="stat.label"
          :stat
        />
      </div>
    </template>
  </u-modal>
</template>
