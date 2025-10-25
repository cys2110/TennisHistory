<script setup lang="ts">
definePageMeta({ name: "event" })
const { viewMode } = useViewMode()
const {
  name: routeName,
  params: { tour, edId, name, year }
} = useRoute("event")

const { data: event } = await useFetch<EventInterface>("/api/events/event", {
  key: `${edId}-${tour}`,
  query: { id: `${edId}-${tour}` }
})

useHead({
  title: () =>
    `${EVENT_PAGES.find(page => page.name === routeName)?.label} | ${event.value?.edition.tournament.name ?? capitalCase(name)} ${year} ${tour}`
})

const tournamentName = useState<string>("tournamentName", () => event.value?.edition.tournament.name ?? capitalCase(name))
</script>

<template>
  <div class="w-full">
    <template v-if="event">
      <events-cards
        v-if="viewMode === 'cards'"
        :event
      />
      <events-table
        v-else
        :event
      />
    </template>
  </div>
</template>
