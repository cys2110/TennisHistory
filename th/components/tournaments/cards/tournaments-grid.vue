<script setup lang="ts">
const { tournaments, count, status } = defineProps<{
  tournaments: Pick<TournamentInterface, "id" | "name" | "years">[]
  status: APIStatusType
  count: number
}>()

const skip = defineModel<number>({ default: 0 })

const grid = useTemplateRef<ComponentPublicInstance>("grid")

onMounted(async () => {
  useInfiniteScroll(
    grid.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 90,
      canLoadMore: () => status !== "pending" && tournaments.length < count
    }
  )
})
</script>

<template>
  <u-page-grid
    v-if="tournaments.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2"
  >
    <base-card
      v-if="tournaments.length"
      v-for="tournament in tournaments"
      :key="tournament.id"
      type="tournament"
      :tournament
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    message="No tournaments found"
    :icon="ICONS.noTournament"
  />
</template>
