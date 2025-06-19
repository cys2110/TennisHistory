<script setup lang="ts">
const { event, tours } = defineProps<{ event: EventDetailsType; tours: TourType[]; status: APIStatusType }>()

const eventDetails = computed(() => {
  if (event) {
    return [
      {
        id: "name",
        title: "Sponsor Name",
        value: event.name ?? "—"
      },
      { id: "category", title: "Category", value: event.category ?? "—", atp: event.atp_category, wta: event.wta_category },
      {
        id: "dates",
        title: "Dates",
        value: event.dates,
        atp: event.atp_dates,
        wta: event.wta_dates
      },
      {
        id: "surface",
        title: "Surface",
        value: event.surface
      },
      {
        id: "venues",
        title: event.venues.length === 1 ? "Venue" : "Venues",
        value: event.venues
      },
      {
        id: "supervisors",
        title: event.supervisors.length === 1 ? "Supervisor" : "Supervisors",
        value: event.supervisors
      },
      {
        id: "pm",
        title: "Prize Money",
        value: event.currency && event.pm ? `${CURRENCIES[event.currency]}${event.pm}` : "—",
        atp: `${CURRENCIES[event.currency]}${event.atp_pm}`
      },
      {
        id: "tfc",
        title: "Total Financial Commitment",
        value: event.currency && event.tfc ? `${CURRENCIES[event.currency]}${event.tfc}` : "—",
        atp: `${CURRENCIES[event.currency]}${event.atp_tfc}`,
        wta: `${CURRENCIES[event.currency]}${event.wta_tfc}`
      }
    ]
  }
  return []
})
</script>

<template>
  <div>
    <div
      v-for="detail in eventDetails"
      :key="detail.id"
      class="grid grid-cols-4"
    >
      <span>{{ detail.title }}</span>
      <span>{{ detail.value }}</span>
      <span v-if="detail.atp">ATP: {{ detail.atp }}</span>
      <span v-if="detail.wta">WTA: {{ detail.wta }}</span>
    </div>
  </div>
</template>
