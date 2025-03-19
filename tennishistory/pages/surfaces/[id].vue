<script setup lang="ts">
definePageMeta({
  name: "surface",
  layout: "dashboard-layout"
})
</script>

<template>
  <div> Page: surfaces/[id] </div>
</template>

<!-- <script setup lang="ts">
const { type, id, name, title } = defineProps<{ type: string; id: string; name?: string; title: string }>()

// API call
const apiRoute = computed(() => {
  switch (type) {
    case "venues":
      return "/api/venueSearch"
    default:
      return "/api/eventSearch"
  }
})

const apiParams = computed(() => {
  switch (type) {
    case "venues":
      return { name, city: id }
    case "surfaces":
      return { id, label: "Surface", relationship: "ON_SURFACE" }
    default:
      return { id, label: "Supervisor", relationship: "SUPERVISED" }
  }
})

const { data: events } = await useFetch<Pick<Event, "name" | "eid" | "tid" | "year">[]>(apiRoute.value, { query: apiParams.value })
</script>

<template>
  <u-modal
    :title
    :description="type"
  >
    <template #body>
      <u-page-list
        v-if="events"
        class="gap-5"
      >
        <u-page-card
          v-for="event in events"
          :key="event.eid"
          :title="`${event.name} ${event.year}`"
          :to="`/tournaments/${useChangeCase(event.name, 'kebabCase').value}/${event.tid}/${event.year}/${event.eid}`"
          highlight
        />
      </u-page-list>
      <error-message
        v-else
        :icon="ICONS['no-calendar']"
        :title="`No events found for ${name ?? id}`"
      />
    </template>
  </u-modal>
</template> -->
