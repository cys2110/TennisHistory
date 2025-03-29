<script setup lang="ts">
definePageMeta({ name: "stats", layout: false })
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const id = useRouteParams<string>("id")
const toast = useToast()
const formatName = useFormatName()
const startYear = useState<number>("startYear")
const endYear = useState<number>("endYear")
const yearsArray = ref<number[]>(startYear.value > 0 ? Array.from({ length: (endYear.value > 0 ? endYear.value : new Date().getFullYear()) - startYear.value + 1 }, (_, i) => (endYear.value > 0 ? endYear.value : new Date().getFullYear()) - i) : [])
const years = ref<number[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()
const checked = ref(mdAndUp.value ? false : true)

// API call
const { data: stats } = await useFetch<PlayerStatsInterface[]>("/api/player-stats", {
  query: { id, years, surfaces },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s stats`,
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
          v-if="yearsArray.length > 0"
          v-model="years"
          :items="yearsArray"
        />
        <surface-select v-model="surfaces" />
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :checked-icon="ICONS.table"
          :unchecked-icon="ICONS['bar-chart']"
          :label="checked ? 'Table view' : 'Chart view'"
          class="justify-self-end"
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
        :icon="ICONS['no-chart']"
        :title="`No stats available for ${formatName.capitaliseName.value}`"
      />
    </nuxt-layout>
  </div>
</template>
