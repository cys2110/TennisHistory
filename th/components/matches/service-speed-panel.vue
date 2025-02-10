<script setup lang="ts">
defineProps<{ stats: { key?: string; label: string; percent?: boolean; value: number[] }[] }>()
const checked = ref(false)
</script>

<template>
  <u-container class="my-10">
    <div class="flex justify-between mb-10">
      <div class="text-2xl font-semibold">Service Speed</div>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS.gauge"
        :unchecked-icon="ICONS.table"
        color="secondary"
        size="lg"
      />
    </div>

    <div
      v-if="checked"
      class="flex flex-col gap-1 xl:flex-row"
    >
      <service-speed-gauge
        v-for="stat in stats"
        :key="stat.label"
        :stat
      />
    </div>

    <service-speed-table
      v-else
      :stats
    />
  </u-container>
</template>
