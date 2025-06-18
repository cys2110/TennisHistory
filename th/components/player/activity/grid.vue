<script setup lang="ts">
defineProps<{
  activity: PlayerActivityType[]
  year: string
  status: APIStatusType
  tour: TourType
  type: "Singles" | "Doubles"
}>()
const { icons } = useAppConfig()
const {
  params: { name }
} = useRoute()
</script>

<template>
  <u-page-list
    v-if="activity.length || ['pending', 'idle'].includes(status)"
    class="m-10 gap-10 w-full xl:w-2/3 2xl:w-1/2 mx-auto"
  >
    <player-activity-card
      v-if="activity.length"
      v-for="event in activity"
      :key="event.id"
      :id="`event-${event.id}`"
      :event
      :year
      :tour
      :type
    />
    <loading-activity-card
      v-else
      v-for="_ in 3"
      :key="_"
    />
  </u-page-list>

  <error-message
    v-else
    :message="`${name} had no ${type} activity in ${year}`"
    :icon="icons.noCalendar"
  />
</template>
