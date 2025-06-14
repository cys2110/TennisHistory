<script setup lang="ts">
const { tournament, id, year } = defineProps<{
  tournament: Pick<TournamentType, "name" | "id">
  id: number
  year: number
}>()
const { icons } = useAppConfig()
</script>

<template>
  <template
    v-for="page in EVENT_PAGES"
    :key="page.name"
  >
    <u-button
      size="xs"
      :label="page.label"
      :icon="page.icon"
      :to="{ name: page.name, params: { name: tournament.name, id: tournament.id, year, eid: id } }"
      :ui="{ leadingIcon: page.icon === icons.draw ? 'rotate-90' : undefined }"
    />
  </template>
</template>
