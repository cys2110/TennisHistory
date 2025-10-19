<script setup lang="ts">
const { status, count, tournaments } = defineProps<{
  tournaments: TournamentInterface[]
  resetFilters: () => void
  count: number
  status: APIStatusType
}>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: useSSRWidth() })
const mdAndDown = breakpoints.smallerOrEqual("md")

const skip = defineModel<number>("skip")
const filters = defineModel<TournamentFiltersType>("filters")

const grid = useTemplateRef<HTMLDivElement>("grid")

onMounted(() => {
  if (!grid.value) return
  useInfiniteScroll(
    grid.value,
    () => {
      set(skip, get(skip)! + 40)
    },
    {
      distance: 10,
      canLoadMore: () => {
        return get(status) !== "pending" && count > tournaments.length
      }
    }
  )
})
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <div class="font-semibold">{{ count }} tournament{{ count === 1 ? "" : "s" }}</div>

          <dev-only>
            <tournament-create
              size="xs"
              class="my-2"
            />
          </dev-only>

          <u-button
            label="Reset Filters"
            :icon="ICONS.noFilter"
            @click="resetFilters"
            block
            size="xs"
            class="my-2"
          />

          <div
            v-if="filters"
            class="flex flex-col gap-3"
          >
            <u-checkbox-group
              legend="Tours"
              v-model="filters.tours"
              :items="Object.entries(TourEnum).map(tour => ({ label: tour[1], value: tour[0] }))"
              :ui="{ item: 'ml-3' }"
            />

            <u-form-field label="Established">
              <form-input
                v-if="filters"
                v-model="filters.established"
                type="number"
                placeholder="Year established"
                block
              />
            </u-form-field>

            <u-form-field label="Abolished">
              <form-input
                v-if="filters"
                v-model="filters.abolished"
                type="number"
                placeholder="Year abolished"
                block
              />
            </u-form-field>
          </div>
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <form-command-palette-search
            v-if="filters"
            type="Tournaments"
            v-model:model-value="filters.tournaments"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Tournaments">
        <template
          #links
          v-if="mdAndDown"
        >
          <u-slideover
            title="Filters"
            class="ml-auto"
          >
            <u-button :icon="ICONS.filter" />

            <template #body>
              <div class="font-semibold">{{ count }} tournament{{ count === 1 ? "" : "s" }}</div>

              <dev-only>
                <tournament-create size="xs" />
              </dev-only>

              <u-button
                label="Reset Filters"
                :icon="ICONS.noFilter"
                @click="resetFilters"
                block
                size="xs"
              />

              <div
                v-if="filters"
                class="flex flex-col gap-5"
              >
                <form-select-search
                  v-if="filters"
                  v-model="filters.tournaments"
                  placeholder="Select tournaments"
                  type="tournaments"
                  :icon="ICONS.tournament"
                  block
                />

                <u-checkbox-group
                  legend="Tours"
                  v-model="filters.tours"
                  :items="Object.entries(TourEnum).map(tour => ({ label: tour[1], value: tour[0] }))"
                  :ui="{ item: 'ml-3' }"
                />

                <form-input
                  v-if="filters"
                  v-model="filters.established"
                  type="number"
                  placeholder="Year established"
                  block
                />

                <form-input
                  v-if="filters"
                  v-model="filters.abolished"
                  type="number"
                  placeholder="Year abolished"
                  block
                />
              </div>
            </template>
          </u-slideover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-grid
          v-if="tournaments.length || status === 'pending'"
          ref="grid"
        >
          <div
            v-if="tournaments.length"
            v-for="tournament in tournaments"
            :key="tournament.id"
            :id="tournament.id.toString()"
          >
            <u-page-card
              highlight
              :highlight-color="getTourColour(tournament.tours)"
              :ui="{ root: 'h-full', body: 'w-full', leading: 'flex items-center gap-2', footer: 'text-sm w-full' }"
            >
              <template #leading>
                <u-badge
                  v-for="tour in tournament.tours"
                  :key="tour"
                  :color="getTourColour(tour)"
                  :label="tour"
                />
              </template>

              <template #title>
                <u-link
                  :to="{ name: 'tournament', params: { id: tournament.id, name: kebabCase(tournament.name ?? '-') } }"
                  class="hover-link default-link"
                >
                  {{ tournament.name }}
                </u-link>
              </template>

              <template #description>
                <span v-if="tournament.established">{{ tournament.established }}</span>
                <span v-if="tournament.established && !tournament.abolished"> - present</span>
                <span v-else-if="tournament.abolished && tournament.established !== tournament.abolished"> - {{ tournament.abolished }}</span>
              </template>
            </u-page-card>
          </div>

          <loading-base
            v-if="status === 'pending'"
            v-for="_ in 6"
            :key="_"
          />
        </u-page-grid>

        <empty-cards
          v-else
          :icon="ICONS.noTournament"
          message="No tournaments found"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
