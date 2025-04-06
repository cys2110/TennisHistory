<script setup lang="ts">
defineProps<{ checked: boolean }>()
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

interface APIResponse {
  age: string
  player: PlayerInterface
  year: string
}

// API calls
const { data: ages, status } = await useFetch<APIResponse[]>("/api/tournament-winner-ages", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching winners by country for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Winners by Age"
    :icon="ICONS.calendar"
  >
    <div v-if="ages">
      <winners-by-age-table
        v-if="checked"
        :ages
      />
      <winners-by-age-chart
        v-else
        :ages
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noCountries"
      :status
      :title="`No winners by country found for ${name}`"
    />
  </dashboard-subpanel>
</template>
