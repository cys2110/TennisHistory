<script setup lang="ts">
defineProps<{
  event: EventInterface | undefined
  status: APIStatusType
}>()
const {
  params: { year }
} = useRoute()

const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")
</script>

<template>
  <u-page-columns
    v-if="event"
    class="xl:columns-4 2xl:columns-5"
  >
    <details-card
      v-if="event.sponsor_name"
      title="Sponsor Name"
      :value="event.sponsor_name"
    />

    <details-card
      v-if="event.atp_category || event.wta_category || event.men_category || event.women_category"
      title="Category"
    >
      <div class="flex flex-col">
        <u-link
          v-if="event.atp_category"
          class="hover-link"
          :class="{ 'atp-link': tours.length > 1 }"
          :to="{ name: 'category', params: { id: kebabCase(event.atp_category) } }"
        >
          {{ event.atp_category }}
        </u-link>
        <u-link
          v-if="event.wta_category"
          class="hover-link"
          :class="{ 'wta-link': tours.length > 1 }"
          :to="{ name: 'category', params: { id: kebabCase(event.wta_category) } }"
        >
          {{ event.wta_category }}
        </u-link>
        <u-link
          v-if="event.men_category"
          class="hover-link"
          :class="{ 'men-link': tours.length > 1 }"
          :to="{ name: 'category', params: { id: kebabCase(event.men_category) } }"
        >
          {{ event.men_category }}
        </u-link>
        <u-link
          v-if="event.women_category"
          class="hover-link"
          :class="{ 'women-link': tours.length > 1 }"
          :to="{ name: 'category', params: { id: kebabCase(event.women_category) } }"
        >
          {{ event.women_category }}
        </u-link>
      </div>
    </details-card>

    <details-card title="Dates">
      <div class="flex flex-col">
        <div
          v-if="event.atp_start_date && event.atp_end_date"
          :class="{ 'text-atp': tours.length > 1 }"
        >
          {{ dateTimeFormat.formatRange(getDate(event.atp_start_date), getDate(event.atp_end_date)) }}
        </div>
        <div
          v-if="event.wta_start_date && event.wta_end_date"
          :class="{ 'text-wta': tours.length > 1 }"
        >
          {{ dateTimeFormat.formatRange(getDate(event.wta_start_date), getDate(event.wta_end_date)) }}
        </div>
        <div
          v-if="event.men_start_date && event.men_end_date"
          :class="{ 'text-men': tours.length > 1 }"
        >
          {{ dateTimeFormat.formatRange(getDate(event.men_start_date), getDate(event.men_end_date)) }}
        </div>
        <div
          v-if="event.women_start_date && event.women_end_date"
          :class="{ 'text-women': tours.length > 1 }"
        >
          {{ dateTimeFormat.formatRange(getDate(event.women_start_date), getDate(event.women_end_date)) }}
        </div>
      </div>
    </details-card>

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
          class="hover-link font-bold w-fit mx-auto"
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
      v-if="(event.atp_pm && event.atp_currency) || (event.men_pm && event.men_currency) || (event.women_pm && event.women_currency)"
      title="Total Financial Commitment"
    >
      <div class="flex flex-col">
        <div
          v-if="event.atp_pm"
          :class="{ 'text-atp': tours.length > 1 }"
        >
          {{ event.atp_pm.toLocaleString("en-GB", { style: "currency", currency: event.atp_currency }) }}
        </div>
        <div
          v-if="event.men_pm"
          :class="{ 'text-men': tours.length > 1 }"
        >
          {{ event.men_pm.toLocaleString("en-GB", { style: "currency", currency: event.men_currency }) }}
        </div>
        <div
          v-if="event.women_pm"
          :class="{ 'text-women': tours.length > 1 }"
        >
          {{ event.women_pm.toLocaleString("en-GB", { style: "currency", currency: event.women_currency }) }}
        </div>
      </div>
    </details-card>

    <details-card
      v-if="(event.atp_tfc && event.atp_currency) || (event.wta_tfc && event.wta_currency)"
      title="Total Financial Commitment"
    >
      <div class="flex flex-col">
        <div
          v-if="event.atp_tfc"
          :class="{ 'text-atp': tours.length > 1 }"
        >
          {{ event.atp_tfc.toLocaleString("en-GB", { style: "currency", currency: event.atp_currency }) }}
        </div>
        <div
          v-if="event.wta_tfc"
          :class="{ 'text-wta': tours.length > 1 }"
        >
          {{ event.wta_tfc.toLocaleString("en-GB", { style: "currency", currency: event.wta_currency }) }}
        </div>
      </div>
    </details-card>
  </u-page-columns>
  <u-page-columns v-else>
    <loading-base
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :message="`No details found for ${tournament?.name} ${year}`"
  />
</template>
