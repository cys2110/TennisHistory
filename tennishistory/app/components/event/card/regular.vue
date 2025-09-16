<script setup lang="ts">
const { event } = defineProps<{ event: EventInterface }>()
const { icons } = useAppConfig()

const eventStartDate = computed(() => {
  if (event.dates[0]?.[0]) return event.dates[0][0] as DateType

  const startDates = event.dates.filter(date => date[0]).map(date => date[0])

  return useSorted(startDates, (a, b) => {
    if (a!.year !== b!.year) return a!.year - b!.year
    if (a!.month !== b!.month) return a!.month - b!.month
    return a!.day - b!.day
  }).value[0]
})
</script>

<template>
  <div
    :id="`event-${event.id}`"
    class="scroll-mt-[calc(var(--ui-header-height)+2rem)]"
  >
    <u-page-card
      highlight
      :highlight-color="getTourColour(event.tours)"
      reverse
      :ui="{
        description: 'text-sm flex flex-col gap-1',
        wrapper: 'order-last flex flex-col items-start',
        body: 'flex-1 w-full',
        footer: 'mx-auto'
      }"
    >
      <!--Need 'order-last' class for smaller screens and 'h-full' to make all cards the same height-->

      <u-link
        v-if="event.surface"
        :to="{ name: 'surface', params: { id: kebabCase(event.surface.id) } }"
      >
        <nuxt-img
          :src="`/surfaces/${event.surface.surface}.jpg`"
          :alt="event.surface.id"
          class="opacity-75 rounded-lg"
        />
      </u-link>
      <nuxt-img
        v-else
        src="/surfaces/Court.png"
        alt="Various"
        class="opacity-55 rounded-lg"
      />

      <template #leading>
        <country-link
          v-if="event.venues.length"
          :country="event.venues?.[0]?.country!"
        />
        <u-icon
          v-else
          :name="icons.countries"
        />
      </template>

      <template #title>
        <u-link
          :to="{ name: 'tournament', params: { id: event.tournament.id, name: kebabCase(event.tournament.name) } }"
          class="hover-link default-link"
        >
          {{ event.tournament.name }}
        </u-link>
      </template>

      <template #description>
        <div v-if="event.sponsor_name">{{ event.sponsor_name }}</div>

        <template
          v-for="(category, index) in event.categories"
          :key="`${event.id}-${category}`"
        >
          <u-link
            v-if="category"
            :to="{ name: 'category', params: { id: kebabCase(category) } }"
            :class="`hover-link ${tourColourMapping[index]}-link`"
          >
            {{ category }}
          </u-link>
        </template>

        <template
          v-for="(dates, index) in event.dates"
          :key="`${event.id}-date-${index}`"
        >
          <div
            v-if="dates[0] && dates[1]"
            :class="`text-${tourColourMapping[index]}`"
          >
            {{ dateTimeFormat.formatRange(getDate(dates[0]), getDate(dates[1])) }}
          </div>
        </template>

        <div v-if="event.venues?.length">
          <div
            v-for="(venue, index) in event.venues"
            :key="venue.id"
            class="flex flex-wrap gap-1 items-center"
          >
            <u-link
              :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
              class="hover-link default-link"
            >
              {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
            </u-link>
            <u-separator
              v-if="index < event.venues.length - 1"
              class="h-4"
              orientation="vertical"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <event-buttons
          :tournament="event.tournament"
          :year="event.year"
          :id="event.id"
          :start_date="eventStartDate"
        />
      </template>
    </u-page-card>
  </div>
</template>
