<script setup lang="ts">
defineProps<{
  title: string
  value?: string | number
  description?: string
  tour?: TourType | TourType[]
}>()
</script>

<template>
  <u-card
    :ui="{
      root: tour ? `ring-${getTourColour(Array.isArray(tour) ? tour : [tour])}` : 'ring-joint',
      header: 'font-semibold text-muted flex justify-between items-center',
      body: 'text-center text-sm'
    }"
  >
    <template #header>
      {{ title }}
      <slot
        name="icon"
        v-if="$slots.icon"
      />
    </template>

    <slot v-if="$slots.default" />

    <div
      v-else
      class="font-semibold"
    >
      <div>{{ value }}</div>
    </div>
  </u-card>
</template>
