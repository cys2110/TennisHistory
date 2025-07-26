<script setup lang="ts">
const { icons } = useAppConfig()
const page = ref(1)
const letter = defineModel<string | undefined>()
const skip = defineModel<number>("skip")

watch(
  () => [letter, skip],
  () => (page.value = 1)
)

// API call
const { data, status } = await useFetch<TournamentsAPIType>("/api/tournaments", {
  key: `tournaments-${letter}-${skip}-${page}`,
  query: { letter, skip, page },
  default: () => ({ count: 0, tournaments: [] })
})
</script>

<template>
  <u-page-grid
    v-if="data.count || status === 'pending'"
    class="xl:grid-cols-3 2xl:grid-cols-4 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 md:gap-8 scroll-smooth"
  >
    <u-page-card
      v-if="data.count"
      v-for="tournament in data.tournaments"
      :key="tournament.id"
      :to="{ name: 'tournament', params: { id: tournament.id, name: kebabCase(tournament.name) } }"
      :title="tournament.name"
      highlight
      :highlight-color="getTourColor(tournament.tours)"
      :ui="{ body: 'w-full mx-auto', title: 'text-center' }"
    >
      <template #leading>
        <u-badge
          v-for="tour in tournament.tours"
          :key="tour"
          :color="tour.toLowerCase() as 'atp' | 'wta' | 'men' | 'women'"
          :label="tour"
          class="mx-1"
        />
      </template>
    </u-page-card>
    <loading-base
      v-else
      v-for="_ in 8"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noTournament"
    message="No tournaments found"
  />
  <u-pagination
    v-if="data.count"
    v-model:page="page"
    :total="data.count"
    :items-per-page="skip"
    variant="ghost"
    color="primary"
    active-variant="subtle"
    class="mx-auto mt-auto"
  />
</template>
