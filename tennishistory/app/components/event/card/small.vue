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
        <div>
          <country-link
            v-if="event.venues.length"
            :country="event.venues?.[0]?.country!"
          />
          <u-icon
            v-else
            :name="icons.countries"
          />
        </div>
      </template>

      <div class="gap-2 grid grid-cols-2 items-center">
        <div class="flex flex-col gap-2">
          <template
            v-for="(category, index) in event.categories"
            :key="`${event.id}-${category}`"
          >
            <u-link
              v-if="category"
              :to="{ name: 'category', params: { id: kebabCase(category) } }"
              :class="`underline underline-offset-5 text-${tourColourMapping[index]}`"
            >
              {{ category }}
            </u-link>
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
              {{ dateTimeFormat.formatRange(getDate(dates[0]), getDate(dates[1])) }}
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
  </div>
</template>
