<script setup lang="ts">
defineProps<{ checked: boolean }>()
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

interface APIResponse {
  finals: number
  losses: number
  player: Pick<PlayerInterface, "id" | "name" | "country">
  wins: number
}

// API call
const { data: finalists, status } = await useFetch<APIResponse[]>("/api/tournament-finalists", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching finalists for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Players by No. of Finals"
    :icon="ICONS.upcoming"
  >
    <div v-if="finalists">
      <tournament-finalists-table
        v-if="checked"
        :finalists
      />
      <tournament-finalists-chart
        v-else
        :finalists
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noPlayer"
      :status
      :title="`No finalists found for ${name}`"
    />
  </dashboard-subpanel>
</template>
