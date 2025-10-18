<script setup lang="ts">
const { event } = defineProps<{ event: EventInterface }>()

const eventStartDate = computed(() => {
  if (event.dates[0]?.[0]) return event.dates[0][0]

  const startDates = event.dates.filter(date => date[0]).map(date => date[0])

  return startDates.sort()[0]
})
</script>

<template>
  <u-card
    :ui="{
      root: `ring-${getTourColour(event.tours)}`,
      header: 'flex items-center justify-between',
      body: 'text-xs',
      footer: 'flex justify-center'
    }"
  >
    <template #header>
      <u-link
        :to="{ name: 'tournament', params: { id: event.tournament.id, name: kebabCase(event.tournament.name) } }"
        class="font-semibold underline underline-offset-5"
      >
        {{ event.tournament.name }}
      </u-link>
      <!-- <div>
        <country-link
          v-if="event.venues.length"
          :country="event.venues?.[0]?.country!"
        />
        <u-icon
          v-else
          :name="ICONS.countries"
        />
      </div> -->
    </template>

    <div class="gap-2 grid grid-cols-2 items-center">
      <div class="flex flex-col gap-2">
        <template
          v-for="(category, index) in event.categories"
          :key="`${event.id}-${category}`"
        >
          <div
            v-if="category"
            :class="`text-${tourColourMapping[index]}`"
          >
            {{ category }}
          </div>
        </template>
      </div>

      <div class="flex flex-col items-end text-right">
        <template
          v-for="(dates, index) in event.dates"
          :key="`${event.id}-date-${index}`"
        >
          <div
            v-if="dates[0] && dates[1]"
            :class="`text-${tourColourMapping[index]}`"
          >
            {{ dateTimeFormat.formatRange(new Date(dates[0]), new Date(dates[1])) }}
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <event-buttons
        :tournament="event.tournament"
        :year="event.year"
        :id="event.id"
        :start_date="eventStartDate"
      />
    </template>
  </u-card>
</template>
