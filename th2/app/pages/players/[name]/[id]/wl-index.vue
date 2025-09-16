<script setup lang="ts">
import { PlayerWlIndexGrid, PlayerWlIndexTable } from "#components"

definePageMeta({ name: "wl-index" })
const { viewMode } = useViewMode()
const { params } = useRoute()
const { id } = params as { id: string }
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const mdAndDown = breakpoints.smallerOrEqual("md")
const drawType = ref(["Main"])

// API call
const { data, status } = await useFetch<WLIndexInterface[]>("/api/players/wl-index", {
  key: `wl-index-${id}`,
  query: { id },
  default: () => []
})

const index = computed(() => {
  return data.value.filter(item => drawType.value.includes(item.draw))
})

const toc = [
  { to: "#match-record", label: "Match Record" },
  { to: "#pressure-points", label: "Pressure Points" },
  { to: "#environment", label: "Environment" },
  { to: "#other", label: "Other" }
]
</script>

<template>
  <player-wrapper>
    <template
      v-if="index"
      #toolbar="{ first_name, last_name }"
    >
      <u-checkbox-group
        v-model="drawType"
        :items="['Main', 'Qualifying']"
        orientation="horizontal"
      />

      <div class="flex items-center gap-2">
        <player-wl-index-chart
          v-if="mdAndUp"
          :index="data"
          :first_name="first_name"
          :last_name="last_name"
        />
        <u-dropdown-menu
          v-if="viewMode === 'cards'"
          :items="toc"
        >
          <u-button
            :size="mdAndDown ? 'xs' : 'sm'"
            :icon="icons.toc"
          />
        </u-dropdown-menu>
      </div>
    </template>

    <template #default="{ first_name, last_name }">
      <u-page-header
        v-if="mdAndDown"
        :headline="`${first_name} ${last_name}`"
        title="Win-Loss Index"
      />

      <component
        :is="viewMode === 'cards' ? PlayerWlIndexGrid : PlayerWlIndexTable"
        :index
        :status
        :first_name="first_name"
        :last_name="last_name"
      />
    </template>
  </player-wrapper>
</template>
