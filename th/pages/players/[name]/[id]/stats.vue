<script setup lang="ts">
definePageMeta({ name: "stats", layout: false })
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()
const playerYears = useState<number[]>("player-years")
const years = ref<number[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()
const checked = ref(mdAndUp.value ? false : true)

// API call
const { data: stats, status } = await useFetch<PlayerStatsInterface[]>("/api/player-stats", {
  query: { id, years, surfaces },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name}'s stats`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <template #toolbar>
        <years-select
          v-if="playerYears && playerYears.length > 0"
          v-model="years"
          :items="playerYears"
        />
        <surface-select v-model="surfaces" />
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :checked-icon="ICONS.table"
          :unchecked-icon="ICONS.barChart"
          :label="checked ? 'Table view' : 'Chart view'"
        />
      </template>
      <!--Key added to force re-render when select options change-->
      <player-stats-table
        v-if="stats && checked"
        :stats
        :key="JSON.stringify(stats)"
      />
      <player-stats-chart
        v-else-if="stats"
        :stats
      />
      <error-message
        v-else
        :icon="ICONS.noChart"
        :title="`No stats available for ${name}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
