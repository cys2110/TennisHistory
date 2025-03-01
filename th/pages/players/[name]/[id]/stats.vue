<script setup lang="ts">
definePageMeta({ name: "stats", layout: "player-layout" })
const toast = useToast()
const formatName = useFormatName()
const id = useRouteParams<string>("id")
const checked = ref(false)
const surfaces = useRouteQuery("surfaces", variables.SURFACES)
const lastYear = useState<string>("lastYear")
const years = useRouteQuery<string[]>("years", [lastYear.value])
const yearsArray = useState<string[]>("yearsArray")

// Get player's stats
const { data: stats } = await useFetch<PlayerStatsType[]>("/api/playerStats", {
  query: { id, years, surfaces },
  onResponseError: error => {
    toast.add({
      title: "Error fetching player's stats",
      icon: ICONS.error,
      description: error.error?.message
    })
  }
})
</script>

<template>
  <u-container v-if="stats">
    <u-container class="flex justify-between items-center w-full">
      <year-select
        v-model="years"
        :items="yearsArray"
      />
      <surface-select v-model="surfaces" />
      <u-switch
        v-model="checked"
        :checked-icon="ICONS['bar-chart']"
        :unchecked-icon="ICONS.table"
      />
    </u-container>
    <u-container>
      <player-stats-chart
        v-if="checked"
        :stats
      />
      <player-stats-table
        v-else
        :stats
      />
    </u-container>
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-chart']"
    :title="`${formatName.capitaliseName.value}'s stats are not available`"
  />
</template>
