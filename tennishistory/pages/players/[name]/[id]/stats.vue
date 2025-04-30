<script setup lang="ts">
definePageMeta({ name: "stats" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

const playerYears = useState<string[]>("player-years")
const years = ref<string[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()
const checked = ref(false)

// API call
const { data: stats, status } = await useFetch<PlayerStatsType[]>("/api/players/player-stats", {
  query: { id: route.params.id, years, surfaces },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s stats`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <template #toolbar>
        <years-select
          v-if="playerYears.length"
          v-model="years"
          :items="playerYears"
        />
        <surface-select v-model="surfaces" />
        <ClientOnly>
          <u-switch
            v-if="mdAndUp"
            v-model="checked"
            :checked-icon="ICONS.barChart"
            :unchecked-icon="ICONS.table"
            :label="checked ? 'Chart' : 'Table'"
          />
        </ClientOnly>
      </template>

      <div v-if="stats || ['pending', 'idle'].includes(status)">
        <!--Key added to force re-render when select options change-->
        <player-stats-chart
          v-if="checked && mdAndUp && stats"
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
      />
    </nuxt-layout>
  </div>
</template>
