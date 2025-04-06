<script setup lang="ts">
defineProps<{ checked: boolean }>()
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

interface APIResponse {
  year: number
  pm: number
  R128?: number
  R64?: number
  R32: number
  R16: number
  QF: number
  SF: number
  F: number
  currency: CurrencyType
  yoy: string
}

// API call
const { data: pm, status } = await useFetch<APIResponse[]>("/api/tournament-historical-pm", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching prize money for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Historical Prize Money"
    :icon="ICONS.awards"
  >
    <div v-if="pm">
      <tournament-historical-pm-table
        v-if="checked"
        :pm
      />
      <tournament-historical-pm-chart
        v-else
        :pm
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noAwards"
      :status
      :title="`No prize money found for ${name}`"
    />
  </dashboard-subpanel>
</template>
