<script setup lang="ts">
defineProps<{
  stats: MatchStatsType[]
  label?: string
  category: string
}>()
const { params } = useRoute()
const { year } = params as { year?: string }
const { icons } = useAppConfig()
const tournament = inject<string>("tournament", "")
</script>

<template>
  <u-modal
    :title="`${tournament} ${year}`"
    description="Service Speed"
    fullscreen
  >
    <u-button
      :label="label ?? 'Chart'"
      :icon="icons.gauge"
      block
      color="active"
    />

    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <match-speed-gauge
          v-for="stat in stats"
          :key="stat.label"
          :stat
        />
      </div>
    </template>
  </u-modal>
</template>
