<script setup lang="ts">
defineProps<{
  winners: TournamentAgeType[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const { icons } = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const getAge = (age: { months: number; days: number }) => {
  const years = Math.floor(age.months / 12)
  const months = age.months % 12
  const days = age.days
  return `${years} years, ${months} months, ${days} days`
}
</script>

<template>
  <u-page-grid
    v-if="winners.length || status === 'pending'"
    class="2xl:grid-cols-4 max-h-165 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent"
  >
    <template
      v-if="winners.length"
      v-for="winner in winners"
      :key="winner.id"
    >
      <u-card
        v-if="winner.age"
        :ui="{ root: `ring-${getTourColor([winner.player.tour])}`, body: 'text-center' }"
      >
        <template #header>
          <div class="flex justify-between items-center font-semibold">
            <player-link :player="winner.player" />
            <div class="flex items-center gap-1">
              <u-badge
                :label="winner.player.tour"
                :color="getTourColor([winner.player.tour])"
              />

              <u-badge
                :label="winner.type"
                :color="winner.type === 'Singles' ? 'singles' : 'doubles'"
              />
            </div>
          </div>
        </template>

        {{ getAge(winner.age) }}
      </u-card>
    </template>

    <loading-base
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noCalendar"
    :message="`No winners found for ${tournamentName}`"
  />
</template>
