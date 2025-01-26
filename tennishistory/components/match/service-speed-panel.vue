<script setup lang="ts">
defineProps<{ stats: MatchStatsType[] }>()
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
        :ui="{ base: 'data-[state=unchecked]:bg-emerald-500 data-[state=unchecked]:dark:bg-emerald-800', icon: 'group-data-[state=unchecked]:text-emerald-700' }"
      />
    </div>
    <div
      v-if="checked"
      class="flex gap-2"
    >
      <service-speed-gauge
        v-for="stat in stats"
        :key="stat.name"
        :stat
      />
    </div>
    <service-speed-table
      v-else
      :stats
    />
  </u-container>
</template>
