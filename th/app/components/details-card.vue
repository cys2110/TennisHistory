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
    :class="tour ? `ring-${getTourColor(Array.isArray(tour) ? tour : [tour])}` : 'ring-joint'"
    :ui="{
      header: 'font-bold text-center',
      body: 'text-center'
    }"
  >
    <template #header>{{ title }}</template>

    <slot
      name="description"
      v-if="$slots.description"
    />
    <div
      v-else
      class="font-semibold"
    >
      <div class="font-extrabold">{{ value }}</div>
      <div
        v-if="description"
        class="text-sm font-semibold text-dimmed"
      >
        {{ description }}
      </div>
    </div>
  </u-card>
</template>
