<script setup lang="ts">
defineProps<{ event: EventInterface | undefined; status: APIStatusType; tournament: TournamentInterface }>()
const {
  params: { year }
} = useRoute()
</script>

<template>
  <u-page-columns
    v-if="event"
    class="xl:columns-4 2xl:columns-5"
  >
    <details-card
      title="Dates"
      :value="dateTimeFormat.formatRange(getDate(event.start_date!), getDate(event.end_date!))"
    />

    <details-card
      v-if="event.surface"
      title="Surface"
    >
      <u-link
        class="hover-link font-bold"
        :to="{ name: 'surface', params: { id: kebabCase(event.surface.id) } }"
      >
        {{ event.surface.id }}
      </u-link>
    </details-card>

    <details-card
      v-if="event.venues.length"
      :title="event.venues.length === 1 ? 'Venue' : 'Venues'"
    >
      <template #icon>
        <country-link :country="event.venues[0]!.country" />
      </template>

      <div class="flex flex-col">
        <u-link
          v-for="venue in event.venues"
          :key="venue.id"
          class="hover-link font-bold mx-auto w-fit"
          :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
        >
          {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
        </u-link>
      </div>
    </details-card>

    <details-card
      v-if="event.supervisors.length"
      :title="event.supervisors.length === 1 ? 'Supervisor' : 'Supervisors'"
    >
      <div class="flex flex-col">
        <u-link
          v-for="supervisor in event.supervisors"
          :key="supervisor.id"
          class="hover-link font-bold w-fit mx-auto"
          :to="{ name: 'supervisor', params: { id: kebabCase(supervisor.id) } }"
        >
          {{ supervisor.id }}
        </u-link>
      </div>
    </details-card>

    <details-card
      v-if="event.tfc && event.currency"
      title="Total Financial Commitment"
      :value="event.tfc.toLocaleString('en-GB', { style: 'currency', currency: event.currency })"
    />
  </u-page-columns>
  <u-page-columns v-else>
    <loading-base
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :message="`No details found for ${tournament.name} ${year}`"
  />
</template>
