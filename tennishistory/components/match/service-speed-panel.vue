<script setup lang="ts">
defineProps<{
  stats: {
    name: string
    p1: {
      low: number
      high: number
    }
    p2: {
      low: number
      high: number
    }
  }[]
  p1_name: string
  p2_name: string
  p1_id: string
  p2_id: string
}>()
const checked = ref(false)
</script>

<template>
  <u-container>
    <u-switch
      v-model="checked"
      :checked-icon="ICONS.gauge"
      :unchecked-icon="ICONS.table"
    />
    <div
      v-if="checked"
      class="flex gap-2"
    >
      <service-speed-gauge
        v-for="stat in stats"
        :key="stat.name"
        :stat
        :p1_name
        :p2_name
        :p1_id
        :p2_id
      />
    </div>
    <service-speed-table
      v-else
      :stats
      :p1_name
      :p2_name
      :p1_id
      :p2_id
    />
  </u-container>
</template>
