<script setup lang="ts">
const {
  tournament,
  year,
  id,
  draw_type,
  start_date,
  orientation = "horizontal",
  ui
} = defineProps<{
  tournament: Pick<TournamentInterface, "id" | "name">
  year: string
  id: string
  draw_type: DrawType
  start_date?: string
  orientation?: "horizontal" | "vertical"
  ui?: any
}>()

// Show tooltip/disabled button if event has not started yet
const startDate = computed(() => (start_date ? new Date(start_date) : new Date(1968, 0, 1)))
const isDisabled = computed(() => new Date() < startDate.value)

// Only show buttons that match the draw type
const matchedDraws: Record<string, DrawType[]> = {
  draw: ["Round of 128", "Round of 64", "Round of 32"],
  "round-robin-draw": ["Round robin"],
  "country-draw": ["Country draw"],
  "laver-cup-draw": ["Laver Cup"],
  event: ["Round of 128", "Round of 64", "Round of 32", "Round robin", "Laver Cup"],
  "country-event": ["Country draw"],
  results: [
    "Round of 128",
    "Round of 64",
    "Round of 32",
    "Round robin",
    "Laver Cup",
    "Country draw"
  ]
}

const showButton = (page: string) => {
  if (!matchedDraws[page].includes(draw_type)) {
    return false
  }
  return true
}
</script>

<template>
  <u-tooltip
    :disabled="!isDisabled"
    text="Event has not started yet"
  >
    <u-button-group
      size="xs"
      :orientation
    >
      <template
        v-for="page in EVENT_PAGES"
        :key="page.name"
      >
        <u-button
          v-if="showButton(page.name)"
          :label="page.label"
          :icon="page.icon"
          :to="{
            name: page.name,
            params: { name: encodeName(tournament.name), id: tournament.id, year, eid: id }
          }"
          :disabled="isDisabled"
          :ui="{ ...ui, leadingIcon: page.icon === ICONS.draw ? 'rotate-90' : undefined }"
        />
      </template>
    </u-button-group>
  </u-tooltip>
</template>
