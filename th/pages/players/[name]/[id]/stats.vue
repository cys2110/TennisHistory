<script setup lang="ts">
definePageMeta({ name: "stats" })
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const playerYears = useState<string[]>("player-years")
const years = ref<string[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()
const checked = ref(false)

// API call
const { data: stats, status } = await useFetch<PlayerStatsInterface[]>("/api/player-stats", { query: { id, years, surfaces } })
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
          :checked-icon="ICONS.barChart"
          :unchecked-icon="ICONS.table"
          :label="checked ? 'Chart' : 'Table'"
        />
      </template>

      <div v-if="stats || status === 'pending'">
        <!--Key added to force re-render when select options change-->
        <player-stats-chart
          v-if="checked && stats"
          :stats
          :key="JSON.stringify(stats) + 'chart'"
        />

        <player-stats-table
          v-else
          :stats
          :key="JSON.stringify(stats)"
          :status
        />
      </div>

      <error-message
        v-else
        :icon="ICONS.noChart"
        :title="`No stats available for ${name}`"
        :status
        :error="`Error fetching ${name}'s stats`"
      />
    </nuxt-layout>
  </div>
</template>
