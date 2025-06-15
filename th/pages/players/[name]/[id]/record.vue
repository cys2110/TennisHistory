<script setup lang="ts">
import { PlayerRecordGrid, PlayerRecordTable } from "#components"

definePageMeta({ name: "record" })
const { viewMode } = useViewMode()

const { name, params } = useRoute()
const playerName = computed(() => decodeName(params.name as string))
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: playerName.value } })

// API call
const { data: results, status } = await useFetch<APIPlayerRecordType>("/api/players/record", {
  query: { id: params.id },
  default: () => ({ singles: {}, doubles: {}, min_year: 0, max_year: 0 })
})
</script>

<template>
  <player-wrapper v-slot="{ tour }">
    <component
      :is="viewMode === 'cards' ? PlayerRecordGrid : PlayerRecordTable"
      :key="viewMode"
      :results
      :status
      :tour
    />
  </player-wrapper>
</template>
