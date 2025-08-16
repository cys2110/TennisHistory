<script setup lang="ts">
const { icons } = useAppConfig()
const { itemsPerPage } = useDefaults()
const appConfig = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const letter = ref<string | undefined>()
const skip = ref(itemsPerPage.value)
const page = ref(1)

watch(
  () => [letter, skip],
  () => (page.value = 1)
)

interface APIResponse {
  count: number
  tournaments: TournamentInterface[]
}

// API call
const { data, status } = await useFetch<APIResponse>("/api/tournaments", {
  key: `tournaments-${letter}-${skip}-${page}`,
  query: { letter, skip, page },
  default: () => ({ count: 0, tournaments: [] })
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <u-slideover
        v-if="mdAndDown"
        title="Filters"
        class="ml-auto"
      >
        <u-button
          :icon="icons.filter"
          size="xs"
        />
        <template #body>
          <u-form-field label="Items per page">
            <u-slider
              v-model="skip"
              :min="10"
              :max="100"
              :step="10"
              tooltip
            />
          </u-form-field>
          <filter-letters v-model="letter" />
        </template>
      </u-slideover>
      <u-form-field
        v-else
        label="Items per page"
        :ui="{ labelWrapper: 'justify-end' }"
      >
        <u-slider
          v-model="skip"
          :min="10"
          :max="100"
          :step="10"
          tooltip
          class="min-w-xs"
        />
      </u-form-field>
    </template>

    <template
      #toolbar
      v-if="!mdAndDown"
    >
      <filter-letters
        v-model="letter"
        :ui="{ fieldset: 'flex-wrap gap-2' }"
      />
    </template>

    <u-page-grid
      v-if="data.count || status === 'pending'"
      class="2xl:grid-cols-4 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-5 md:gap-8"
    >
      <u-page-card
        v-if="data.count"
        v-for="tournament in data.tournaments"
        :key="tournament.id"
        :to="{ name: 'tournament', params: { id: tournament.id, name: kebabCase(tournament.name) } }"
        :title="tournament.name"
        highlight
        :highlight-color="getTourColor(tournament.tours)"
        :ui="{ body: 'w-full mx-auto', title: 'text-center', description: 'text-center' }"
      >
        <template #leading>
          <u-badge
            v-for="tour in tournament.tours"
            :key="tour"
            :color="getTourColor([tour])"
            :label="tour"
            class="mx-1"
          />
        </template>
        <template #description>
          <span v-if="tournament.established">{{ tournament.established }}</span>
          <span v-if="tournament.established && !tournament.abolished"> - present</span>
          <span v-else-if="tournament.abolished && tournament.established !== tournament.abolished"> - {{ tournament.abolished }}</span>
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
  </page-wrapper>
</template>
