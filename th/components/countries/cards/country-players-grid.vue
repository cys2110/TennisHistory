<script setup lang="ts">
const { players, count, status } = defineProps<{
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year">[]
  status: APIStatusType
  count: number
  name: string | undefined
}>()

const route = useRoute()
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
      canLoadMore: () => status !== "pending" && players.length < count
    }
  )
})
</script>

<template>
  <u-page-grid
    v-if="players.length || ['pending', 'idle'].includes(status)"
    ref="grid"
    class="max-h-155 overflow-y-auto pt-10 px-4 pb-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 my-5"
  >
    <player-card
      v-if="players.length"
      v-for="player in players"
      :key="player.id"
      :player
    />
    <player-loading-card
      v-else
      v-for="_ in 6"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :message="`No players who previously represented or currently represent ${name ?? route.params.id}`"
  />
</template>
