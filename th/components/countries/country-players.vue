<script setup lang="ts">
defineProps<{ name?: string }>()
const id = useRouteParams<string>("id")

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(15)

// API call
const { data, status } = await useFetch<{ count: number; players: (Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> & { current: boolean })[] }>("/api/country-players", { query: { id, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize.value } })
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
      <u-radio-group
        v-model="selectedLetter"
        :items="LETTERS"
        orientation="horizontal"
        @update:model-value="page = 1"
        size="sm"
        class="mx-auto"
        :ui="{ fieldset: 'grid grid-cols-6 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-10 xl:!grid-cols-16 xl:grid', base: 'cursor-pointer' }"
      />
    </div>

    <u-page-grid
      v-if="data && data.count > 0"
      class="lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 my-5"
    >
      <player-card
        v-for="player in data.players"
        :key="player.id"
        :player
      />
    </u-page-grid>

    <pagination-component
      v-if="data && data.count > 0"
      v-model="page"
      :total="data.count"
      :page-size="pageSize"
    />

    <u-page-grid
      v-else-if="status === 'pending'"
      class="xl:grid-cols-3 2xl:grid-cols-3 mt-5"
    >
      <player-loading-card
        v-for="_ in 6"
        :key="_"
      />
    </u-page-grid>

    <error-message
      v-else
      :title="`No players who previously represented or currently represent ${name ?? id}`"
      :status
      :error="`Error fetching players who previously represented or currently represent ${name ?? id}`"
    />
  </dashboard-subpanel>
</template>
