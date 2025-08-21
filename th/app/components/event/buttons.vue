<script setup lang="ts">
const {
  tournament,
  year,
  id,
  start_date,
  size = "xs"
} = defineProps<{
  tournament: TournamentInterface
  year: number
  id: number
  start_date?: DateType
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}>()

// Show tooltip/disabled button if event has not started yet
const startDate = computed(() => (start_date ? getDate(start_date) : new Date(1968, 0, 1)))
const isDisabled = computed(() => new Date() < startDate.value)
</script>

<template>
  <u-tooltip
    :disabled="!isDisabled"
    text="Event has not started yet"
  >
    <u-button-group :size>
      <!--@vue-expect-error-->
      <u-button
        v-for="page in EVENT_PAGES"
        :key="page.name"
        :label="page.label"
        :icon="page.icon"
        :to="{
          name: page.name,
          params: {
            id: tournament.id,
            name: kebabCase(tournament.name),
            year,
            eid: id
          }
        }"
        :disabled="isDisabled"
      />
    </u-button-group>
  </u-tooltip>
</template>
