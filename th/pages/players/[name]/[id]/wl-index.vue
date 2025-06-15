<script setup lang="ts">
import { PlayerWlIndexGrid, PlayerWlIndexTable } from "#components"

definePageMeta({ name: "wl-index" })
const { viewMode } = useViewMode()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const { name, params } = useRoute()
const playerName = computed(() => decodeName(params.name as string))
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: playerName.value } })

// API call
const { data: index, status } = await useFetch<WLIndexInterface[]>("/api/players/wl-index", {
  query: { id: params.id },
  default: () => []
})
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <player-wl-index-chart
        v-if="mdAndUp && index"
        :index
        class="ml-auto"
      />
    </template>

    <component
      v-if="index"
      :is="viewMode === 'cards' ? PlayerWlIndexGrid : PlayerWlIndexTable"
      :key="viewMode"
      :index
      :status
    />
  </player-wrapper>
</template>
