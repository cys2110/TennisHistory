<script setup lang="ts">
const props = defineProps<{ event: EventDetailsType }>()
const { name, category, dates, surface, venue, city, country, draw, pm, tfc, currency, supervisors } = props.event

const eventDetails = [
  { title: "Sponsor Name", value: name ?? "—" },
  { title: "Category", value: category ?? "—" },
  { title: "Dates", value: dates },
  { title: "Surface", value: surface },
  { title: "Venue", value: `${venue}, ${city}`, icon: `flag:${COUNTRY_CODES[country]}-4x3` },
  { title: "Draw", value: draw },
  { title: supervisors.length === 1 ? "Supervisor" : "Supervisors" },
  { title: "Prize Money", value: currency && pm ? `${CURRENCIES[currency]}${pm}` : "—" },
  { title: "Total Financial Commitment", value: currency && tfc ? `${CURRENCIES[currency]}${tfc}` : "—" }
]
</script>

<template>
  <u-page-grid>
    <u-page-card
      v-for="detail in eventDetails"
      :key="detail.title"
      :title="detail.title"
      :description="detail.value"
      :icon="detail.icon"
    >
      <template
        #description
        v-if="detail.title === 'Supervisors' || detail.title === 'Supervisor'"
      >
        <div
          v-if="supervisors.length > 0"
          v-for="supervisor in supervisors"
          :key="supervisor"
        >
          {{ supervisor }}
        </div>
        <template v-else>—</template>
      </template>
    </u-page-card>
  </u-page-grid>
</template>
