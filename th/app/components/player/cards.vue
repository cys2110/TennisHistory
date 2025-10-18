<script setup lang="ts">
const { status, count, players } = defineProps<{
  players: PlayerInterface[]
  resetFilters: () => void
  count: number
  status: APIStatusType
}>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: useSSRWidth() })
const mdAndDown = breakpoints.smallerOrEqual("md")

const skip = defineModel<number>("skip")
const filters = defineModel<PlayerFiltersType>("filters")
const currentYear = new Date().getFullYear()

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
        return get(status) !== "pending" && count > players.length
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
          <div class="font-semibold">{{ count }} player{{ count === 1 ? "" : "s" }}</div>

          <u-button
            label="Reset Filters"
            :icon="ICONS.noFilter"
            @click="resetFilters"
            block
            size="xs"
            class="my-5"
          />

          <div
            v-if="filters"
            class="flex flex-col gap-5"
          >
            <u-radio-group
              legend="Tour"
              v-model="filters.tour"
              :items="['ATP', 'WTA']"
              :ui="{ item: 'ml-3' }"
            />

            <u-radio-group
              legend="Status"
              v-model="filters.status"
              :items="['Active', 'Inactive']"
              :ui="{ item: 'ml-3' }"
            />

            <u-form-field label="Year of First Tournament">
              <form-input
                v-if="filters"
                v-model="filters.minYear"
                type="number"
                :placeholder="`1968-${currentYear}`"
                block
              />
            </u-form-field>

            <u-form-field label="Year of Last Tournament">
              <form-input
                v-if="filters"
                v-model="filters.maxYear"
                type="number"
                :placeholder="`1968-${currentYear}`"
                block
              />
            </u-form-field>

            <form-select-search
              v-if="filters"
              v-model="filters.countries"
              placeholder="Select country"
              type="countries"
              :icon="ICONS.countries"
              block
            />

            <form-select-search
              v-if="filters"
              v-model="filters.coaches"
              placeholder="Select coaches"
              type="coaches"
              :icon="ICONS.coach"
              block
            />
          </div>
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <form-command-palette-search
            v-if="filters"
            type="Players"
            v-model:model-value="filters.players"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Players">
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
              <div class="font-semibold">{{ count }} player{{ count === 1 ? "" : "s" }}</div>

              <u-button
                label="Reset Filters"
                :icon="ICONS.noFilter"
                @click="resetFilters"
                block
                size="xs"
                class="my-5"
              />

              <div
                v-if="filters"
                class="flex flex-col gap-5"
              >
                <u-radio-group
                  legend="Tour"
                  v-model="filters.tour"
                  :items="['ATP', 'WTA']"
                  :ui="{ item: 'ml-3' }"
                />

                <u-radio-group
                  legend="Status"
                  v-model="filters.status"
                  :items="['Active', 'Inactive']"
                  :ui="{ item: 'ml-3' }"
                />

                <u-form-field label="Year of First Tournament">
                  <form-input
                    v-if="filters"
                    v-model="filters.minYear"
                    type="number"
                    :placeholder="`1968-${currentYear}`"
                    block
                  />
                </u-form-field>

                <u-form-field label="Year of Last Tournament">
                  <form-input
                    v-if="filters"
                    v-model="filters.maxYear"
                    type="number"
                    :placeholder="`1968-${currentYear}`"
                    block
                  />
                </u-form-field>

                <form-select-search
                  v-if="filters"
                  v-model="filters.players"
                  placeholder="Select players"
                  type="players"
                  :icon="ICONS.player"
                  block
                />

                <form-select-search
                  v-if="filters"
                  v-model="filters.countries"
                  placeholder="Select country"
                  type="countries"
                  :icon="ICONS.countries"
                  block
                />

                <form-select-search
                  v-if="filters"
                  v-model="filters.coaches"
                  placeholder="Select coaches"
                  type="coaches"
                  :icon="ICONS.coach"
                  block
                />
              </div>
            </template>
          </u-slideover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-grid
          v-if="players.length || status === 'pending'"
          ref="grid"
        >
          <div
            v-if="players.length"
            v-for="player in players"
            :key="player.id"
            :id="player.id"
          >
            <u-page-card
              highlight
              :highlight-color="getTourColour(player.tour)"
              :ui="{ root: 'h-full', body: 'w-full', leading: 'flex justify-between items-center w-full', footer: 'text-sm w-full' }"
            >
              <template #leading>
                <div>
                  <country-link
                    :country="player.country"
                    icon-only
                  />
                </div>

                <div class="flex items-center gap-2">
                  <u-badge
                    :color="getTourColour(player.tour)"
                    :label="player.tour"
                  />

                  <u-badge
                    :color="player.max_year === currentYear ? 'Active' : 'Inactive'"
                    :label="player.max_year === currentYear ? 'Active' : 'Inactive'"
                  />
                </div>
              </template>

              <template #title>
                <u-link :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) } }"
                  >{{ player.first_name }} {{ player.last_name }}</u-link
                >
              </template>

              <template
                #description
                v-if="player.coaches"
              >
                <div class="font-semibold mb-1">Coaches:</div>
                <div
                  v-for="(coach, index) in player.coaches"
                  :key="coach.id"
                  class="text-sm ml-3"
                >
                  <u-link
                    v-if="coach.labels.includes('Player')"
                    class="hover-link default-link w-fit mx-auto"
                  >
                    {{ coach.first_name }} {{ coach.last_name }}
                  </u-link>
                  <span v-else>{{ coach.first_name }} {{ coach.last_name }}</span>
                  <span v-if="coach.start_date && coach.end_date">
                    ({{ dateTimeFormat.formatRange(new Date(coach.start_date), new Date(coach.end_date)) }})
                  </span>
                  <span v-else-if="coach.start_date"> ({{ useDateFormat(coach.start_date, "DD MMMM YYYY").value }}) </span>
                </div>
              </template>

              <template #footer>
                Active:
                {{
                  player.min_year && player.min_year === player.max_year
                    ? player.min_year
                    : player.min_year && player.max_year === currentYear
                    ? `${player.min_year} - present`
                    : player.min_year
                    ? `${player.min_year} - ${player.max_year}`
                    : "—"
                }}
                <dev-only>
                  <u-button
                    :icon="ICONS.edit"
                    label="Edit player"
                    size="xs"
                    block
                    :to="{ name: 'admin-players', params: { id: player.id } }"
                    class="mt-2"
                  />
                </dev-only>
              </template>
            </u-page-card>
          </div>

          <loading-player
            v-if="status === 'pending'"
            v-for="_ in 6"
            :key="_"
          />
        </u-page-grid>

        <empty-cards
          v-else
          :icon="ICONS.noPeople"
          message="No players found"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
