<script setup lang="ts">
const { name, tid, year, eid, drawType, start } = defineProps<{ name: string; tid: string; year: string; eid: string; drawType: DrawType; start?: string }>()

const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

// Show tooltip/disabled button if event has not started yet
const startDate = computed(() => (start ? new Date(start) : new Date(1968, 0, 1)))
const isDisabled = computed(() => new Date() < startDate.value)

// Only show buttons that match the draw type
const matchedDraws: Record<string, DrawType[]> = {
  draw: ["Round of 128", "Round of 64", "Round of 32"],
  "rr-draw": ["Round robin"],
  "country-draw": ["Country draw"],
  "laver-cup-draw": ["Laver Cup"],
  event: ["Round of 128", "Round of 64", "Round of 32", "Round robin", "Laver Cup"],
  "country-event": ["Country draw"],
  results: ["Round of 128", "Round of 64", "Round of 32", "Round robin", "Laver Cup", "Country draw"]
}
const showButton = (page: string) => {
  if (!matchedDraws[page].includes(drawType)) {
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
    <u-button-group size="xs">
      <template
        v-for="page in EVENT_PAGES"
        :key="page.name"
      >
        <u-button
          v-if="showButton(page.name)"
          :label="page.label"
          :icon="route.name === 'titles-and-finals' && !mdAndUp ? undefined : page.icon"
          :to="{ name: page.name, params: { name: encodeName(name), id: tid, year, eid } }"
          :disabled="isDisabled"
          :ui="{ leadingIcon: page.icon === ICONS.draw ? 'rotate-90' : undefined }"
        />
      </template>
    </u-button-group>
  </u-tooltip>
</template>
