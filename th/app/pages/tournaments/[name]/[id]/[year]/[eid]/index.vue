<script setup lang="ts">
definePageMeta({ name: "event" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { id, year, name, eid } = useRoute().params as { id: string; year: string; name: string; eid: string }

const toc = [
  { label: "Details", to: "#details" },
  { label: "Awards", to: "#awards" },
  { label: "Seeds", to: "#seeds" },
  { label: "Entry Information", to: "#entry-info" },
  { label: "Entries", to: "#entries" }
]
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
            <u-dropdown-menu
              v-if="!COUNTRY_DRAWS.includes(id as string)"
              :items="toc"
            >
              <u-button
                :icon="icons.toc"
                variant="ghost"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <event-country v-if="COUNTRY_DRAWS.includes(id as string)" />

        <event-overview
          v-else
          :tours
          :tournament
        />
      </template>
    </u-dashboard-panel>
  </event-wrapper>
</template>
