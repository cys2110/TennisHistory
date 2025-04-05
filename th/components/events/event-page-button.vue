<script setup lang="ts">
const { name, id, eid, year, drawType } = defineProps<{ name: string; id: string; eid: string; year: string; drawType: DrawType }>()
const route = useRoute()

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
  <template
    v-for="page in EVENT_PAGES"
    :key="page.name"
  >
    <u-button
      v-if="route.name !== page.name && showButton(page.name)"
      size="xs"
      :label="page.label"
      :icon="page.icon"
      :to="{ name: page.name, params: { name, id, eid, year } }"
      prefetch-on="interaction"
    />
  </template>
</template>
