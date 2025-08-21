<script setup lang="ts">
definePageMeta({ name: "results" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { id, year, name, eid } = useRoute().params as { id: string; year: string; name: string; eid: string }
const { viewMode } = useDefaults()

const tourType = ref<TourType>("ATP")
const matchType = ref<MatchType>("Singles")
</script>

<template>
  <event-wrapper v-slot="{ tours, tournament, otherLinks }">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <!--@vue-expect-error-->
            <u-dropdown-menu :items="EVENT_PAGES.map(page => ({ ...page, to: { name: page.name, params: { year, eid, name, id } } }))">
              <u-button
                :icon="icons.layers"
                variant="ghost"
              />
            </u-dropdown-menu>
            <u-dropdown-menu :items="otherLinks">
              <u-button
                :icon="uIcons.ellipsis"
                variant="ghost"
                :ui="{ leadingIcon: 'rotate-90' }"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar v-if="viewMode !== 'list'">
          <filter-radio-tour-type
            v-model="tourType"
            :tours="tours.map(t => t.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')) as TourType[]"
            size="md"
          />

          <filter-radio-match-type
            v-model="matchType"
            size="md"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <event-results-table
          v-if="viewMode === 'list'"
          :tournament
          :tours
        />

        <event-results-grid
          v-else
          v-model:tour="tourType"
          v-model:match="matchType"
          :tournament
        />
      </template>
    </u-dashboard-panel>
  </event-wrapper>
</template>
