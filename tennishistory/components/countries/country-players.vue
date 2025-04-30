<script setup lang="ts">
defineProps<{ name?: string }>()
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(15)

interface CountryPlayerAPIResponse {
  count: number
  players: (Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> & {
    current: boolean
  })[]
}

// API call
const { data, status } = await useFetch<CountryPlayerAPIResponse>("/api/countries/players", {
  query: {
    id: route.params.id,
    skip: computed(() => (page.value - 1) * pageSize.value),
    limit: pageSize.value
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching players who previously represented or currently represent ${
        name ?? route.params.id
      }`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Current/Retired Players"
    :icon="ICONS.player"
  >
    <template #right>
      <set-page-size v-model="pageSize" />
    </template>

    <div>
      <letters-radio-group
        v-model="selectedLetter"
        :ui="{
          fieldset:
            'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-10 xl:!grid-cols-16 xl:grid',
          base: 'cursor-pointer'
        }"
      />
    </div>

    <u-page-grid
      v-if="data?.count || ['pending', 'idle'].includes(status)"
      class="lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 my-5"
    >
      <player-card
        v-if="data"
        v-for="player in data.players"
        :key="player.id"
        :player
      />
      <player-loading-card
        v-else
        v-for="_ in 6"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      :title="`No players who previously represented or currently represent ${
        name ?? route.params.id
      }`"
    />

    <pagination-component
      v-if="data?.count"
      v-model="page"
      :total="data.count"
      :page-size="pageSize"
    />
  </dashboard-subpanel>
</template>
