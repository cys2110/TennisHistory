<script setup lang="ts">
const {
  tournament,
  year,
  id,
  start_date,
  orientation = "horizontal",
  ui,
  size
} = defineProps<{
  tournament: Pick<TournamentType, "name" | "id">
  year: number
  id: number
  start_date?: string
  orientation?: "horizontal" | "vertical"
  ui?: any
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}>()
const { icons } = useAppConfig()

// Show tooltip/disabled button if event has not started yet
const startDate = computed(() => (start_date ? new Date(start_date) : new Date(1968, 0, 1)))
const isDisabled = computed(() => new Date() < startDate.value)
</script>

<template>
  <u-tooltip
    :disabled="!isDisabled"
    text="Event has not started yet"
  >
    <u-button-group
      :size="size ?? 'xs'"
      :orientation
    >
      <u-button
        v-for="page in EVENT_PAGES"
        :key="page.name"
        :label="page.label"
        :icon="page.icon"
        :to="{
          name: page.name,
          params: { name: encodeName(tournament.name), id: tournament.id, year, eid: id }
        }"
        :disabled="isDisabled"
        :ui="{ ...ui, leadingIcon: page.icon === icons.draw ? 'rotate-90' : undefined }"
      />
    </u-button-group>
  </u-tooltip>
</template>
