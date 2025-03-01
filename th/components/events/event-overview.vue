<script setup lang="ts">
const { event } = defineProps<{ event: EventDetailsType }>()

const eventDetails = computed(() => [
  { title: "Sponsor Name", value: event.ename ?? "—" },
  { title: "Category", value: event.category ?? "—" },
  { title: "Dates", value: event.dates },
  { title: "Surface", value: event.surface },
  { title: "Venue", value: `${event.venue}, ${event.city}` },
  { title: "Draw", value: event.draw },
  { title: event.supervisors.length === 1 ? "Supervisor" : "Supervisors" },
  { title: "Prize Money", value: event.currency && event.pm ? `${CURRENCIES[event.currency]}${event.pm}` : "—" },
  { title: "Total Financial Commitment", value: event.currency && event.tfc ? `${CURRENCIES[event.currency]}${event.tfc}` : "—" }
])
</script>

<template>
  <u-page-grid>
    <u-page-card
      v-for="detail in eventDetails"
      :key="detail.title"
      :title="detail.title"
      :description="detail.value"
      highlight
      variant="subtle"
    >
      <template #description>
        <div v-if="detail.title === 'Venue'"> {{ detail.value }} <flag-icon :country="event.country" /> </div>
        <div v-else-if="detail.title === 'Supervisors' || detail.title === 'Supervisor'">
          <div
            v-if="event.supervisors.length > 0"
            v-for="supervisor in event.supervisors"
            :key="supervisor"
          >
            {{ supervisor }}
          </div>
          <template v-else>—</template>
        </div>
      </template>
    </u-page-card>
  </u-page-grid>
</template>
