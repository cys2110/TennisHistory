<script setup lang="ts">
definePageMeta({ name: "stats", layout: "player-layout" })
const route = useRoute()
const toast = useToast()
const checked = ref(false)
const surfaces = ref(SURFACES)
const years = ref<string[]>([])
const yearsArray = ref<string[]>([])

// Get player's active years
const { status: yearsStatus } = await useFetch<{ start: { low: number; high: number }; end: { low: number; high: number } }>("/api/playerActiveYears", {
  query: { id: route.params.id },
  onResponse: ({ response }) => {
    years.value = Array.from({ length: response._data.end.low - response._data.start.low + 1 }, (_, index) => (response._data.start.low + index).toString())
    yearsArray.value = years.value
  },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

// Get player's stats
const { data: stats, status } = await useFetch<PlayerStatsType[]>("/api/playerStats", {
  query: { id: route.params.id, years: years.value, surfaces: surfaces.value },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-page>
    <u-page-body>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS['bar-chart']"
        :unchecked-icon="ICONS.table"
      />
      <!--TODO: Skeleton for stats table-->
      <ClientOnly>
        <u-container v-if="stats">
          <player-stats-chart
            v-if="checked"
            :stats
          />
          <player-stats-table
            v-else
            :stats
          />
        </u-container>
        <error-message
          v-else
          :icon="ICONS['no-chart']"
        >
          {{ useChangeCase(route.params.name as string, "capitalCase").value }}'s stats are not available
        </error-message>
      </ClientOnly>
    </u-page-body>

    <template #right>
      <u-page-aside>
        <u-container>
          <!--TODO: Fix indeterminate value of year select-->
          <ClientOnly>
            <year-select
              v-model="years"
              :items="yearsArray"
            />
          </ClientOnly>
          <surface-select v-model="surfaces" />
        </u-container>
      </u-page-aside>
    </template>
  </u-page>
</template>
