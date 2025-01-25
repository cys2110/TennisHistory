<script setup lang="ts">
const props = defineProps<{ match: MatchType }>()
const { date, dates, surface, court, duration, umpire, p1, winner, p2 } = props.match
</script>

<template>
  <u-card class="w-fit mx-auto">
    <template #header>
      <div class="flex justify-between">
        <span>{{ date ?? dates }}</span>
        <span>{{ surface }}</span>
        <span>{{ duration }}</span>
      </div>
      <div class="flex justify-between my-1">
        <span class="text-sm">{{ court }}</span>
        <span class="text-sm">{{ umpire }}</span>
      </div>
    </template>

    <matchbox-row
      :player="p1"
      :winner
    />
    <matchbox-row
      :player="p2"
      :winner
    />
  </u-card>
</template>
