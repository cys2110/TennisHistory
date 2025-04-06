<script setup lang="ts">
defineProps<{ checked: boolean }>()
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

interface APIResponse {
  year: number
  player: Pick<PlayerInterface, "id" | "name" | "country">
  sets_won: number
  sets_lost: number
  games_won: number
  games_lost: number
  sets_pc: number
  games_pc: number
}

// API call
const { data: scores, status } = await useFetch<APIResponse[]>("/api/tournament-scores-stats", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching games and sets lost for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Winners by Games and Sets Lost"
    :icon="ICONS.scores"
  >
    <div v-if="scores">
      <games-sets-lost-table
        v-if="checked"
        :scores
      />
      <games-sets-lost-chart
        v-else
        :scores
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noScores"
      :status
      :title="`No score stats found for ${name}`"
    />
  </dashboard-subpanel>
</template>
