<script setup lang="ts">
const { icons } = useAppConfig()
const { itemsPerPage } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const currentYear = new Date().getFullYear()
const letter = ref<string | undefined>()
const page = ref(1)
const page_size = ref(itemsPerPage.value)

watch(
  () => [letter, page_size],
  () => (page.value = 1),
  { deep: true }
)

// API call
const { data, status } = await useFetch<{ total: number; player: PlayerInterface }[]>("/api/players", {
  key: `players-${letter.value}-${page_size.value}-${page.value}`,
  query: { letter, pageSize: page_size, page },
  default: () => []
})

const players = computed(() => data.value.map(item => item.player))

// TOC
const toc = computed(() => [
  {
    id: "players",
    items: players.value.map(player => ({
      label: `${player.first_name} ${player.last_name}`,
      to: `#${player.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
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
                    v-model="page_size"
                    :min="10"
                    :max="100"
                    :step="10"
                    tooltip
                    size="sm"
                  />
                </u-form-field>

                <filter-letters v-model="letter" />
              </template>
            </u-slideover>

            <u-popover>
              <u-button
                :size="mdAndDown ? 'xs' : 'sm'"
                :icon="icons.toc"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search players"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :fuse="{ resultLimit: 1000 }"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar v-if="!mdAndDown">
          <filter-letters
            v-model="letter"
            :ui="{ fieldset: 'flex-wrap gap-2' }"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-grid
          v-if="players.length || status === 'pending'"
          class="xl:grid-cols-4 2xl:grid-cols-5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 md:gap-8 scroll-smooth"
        >
          <div
            v-if="players.length"
            v-for="player in players"
            :key="player.id"
            :id="player.id"
          >
            <u-page-card
              :title="`${player.first_name} ${player.last_name}`"
              :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
              highlight
              :highlight-color="getTourColour([player.tour])"
              :ui="{ body: 'w-full', title: 'text-center', description: 'text-center' }"
            >
              <template #leading>
                <div class="flex items-center gap-2">
                  <u-icon
                    :name="getFlagCode(player.country)"
                    class="text-2xl"
                  />
                  <u-badge
                    :color="getTourColour([player.tour])"
                    :label="player.tour"
                  />
                  <u-badge
                    :color="player.max_year === currentYear ? 'active' : 'inactive'"
                    :label="player.max_year === currentYear ? 'Active' : 'Inactive'"
                  />
                </div>
              </template>

              <template #description>
                {{
                  player.min_year && player.min_year === player.max_year ? player.min_year
                  : player.min_year && player.max_year === currentYear ? `${player.min_year} - present`
                  : player.min_year ? `${player.min_year} - ${player.max_year}`
                  : "—"
                }}
              </template>
            </u-page-card>
          </div>

          <loading-player
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>

        <error-message
          v-else
          :icon="icons.noPlayer"
          message="No players found"
        />
      </template>

      <template #footer>
        <div class="p-5 border-t border-muted flex flex-col-reverse gap-3 md:grid md:grid-cols-3 items-center w-full">
          <div class="font-semibold">Total: {{ data[0]?.total ?? 0 }}</div>
          <u-pagination
            v-if="data[0]"
            v-model:page="page"
            :total="data[0].total"
            :items-per-page="page_size"
            variant="ghost"
            color="primary"
            active-variant="subtle"
            class="justify-self-center"
          />
          <u-form-field
            v-if="!mdAndDown"
            label="Items per page"
            :ui="{ labelWrapper: 'justify-end' }"
          >
            <u-slider
              v-model="page_size"
              :min="10"
              :max="100"
              :step="10"
              tooltip
              class="w-xs justify-self-end"
            />
          </u-form-field>
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
