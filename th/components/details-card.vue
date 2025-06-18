<script setup lang="ts">
defineProps<{ detail: DetailsCardType; tour?: TourType }>()
</script>

<template>
  <u-card
    :class="tour ? getTourColours([tour]).ringColour : undefined"
    :ui="{
      header: 'font-bold text-center',
      body: 'text-center'
    }"
  >
    <template #header>{{ detail.title }}</template>
    <slot
      name="description"
      v-if="$slots.description"
    />
    <div
      v-else-if="detail.value"
      class="font-semibold"
    >
      <div class="font-extrabold">{{ detail.value }}</div>
      <div
        v-if="detail.description"
        class="text-sm font-semibold text-dimmed"
      >
        {{ detail.description }}
      </div>
    </div>
    <div
      v-else-if="detail.singles !== null"
      class="grid grid-cols-2 text-center"
    >
      <div>
        <div class="font-extrabold">{{ detail.singles }}</div>
        <div
          v-if="detail.singles_description"
          class="text-sm font-semibold text-dimmed"
        >
          {{ detail.singles_description }}
        </div>
        <div class="text-sm text-dimmed">Singles</div>
      </div>
      <div>
        <div class="font-extrabold">{{ detail.doubles }}</div>
        <div
          v-if="detail.doubles_description"
          class="text-sm font-semibold text-dimmed"
        >
          {{ detail.doubles_description }}
        </div>
        <div class="text-sm text-dimmed">Doubles</div>
      </div>
    </div>
  </u-card>
</template>
