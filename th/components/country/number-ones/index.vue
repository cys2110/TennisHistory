<script setup lang="ts">
import { CountryNumberOnesGrid, CountryNumberOnesTable } from "#components"

const { icons } = useAppConfig()
const { params } = useRoute()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(params.name as string))

// API call
const { data, status } = await useFetch<CountryNumberOneAPIResponseType>("/api/countries/number-ones", {
  query: { id: params.id },
  default: () => ({ singles_players: [], doubles_players: [] })
})
</script>

<template>
  <dashboard-subpanel
    :title="`Players who have achieved No. 1 ranking representing ${name}`"
    :icon="icons.one"
    id="number-ones"
  >
    <component
      :is="viewMode === 'list' ? CountryNumberOnesTable : CountryNumberOnesGrid"
      :key="viewMode"
      :players="data"
      :status
    />
  </dashboard-subpanel>
</template>
