<script setup lang="ts">
const { setViewMode } = useViewMode()

const groups = computed(() => [
  {
    id: "viewMode",
    label: "View mode",
    items: [
      {
        label: "Cards",
        suffix: "View data in cards mode",
        icon: ICONS.cards,
        onSelect: () => setViewMode("cards")
      },
      {
        label: "List",
        suffix: "View data in list mode",
        icon: ICONS.list,
        onSelect: () => setViewMode("list")
      }
    ]
  },
  {
    id: "links",
    label: "Go to...",
    items: NAV_LINKS
  }
])
</script>

<template>
  <u-dashboard-group>
    <!--Command palette-->
    <u-dashboard-search :groups />

    <u-dashboard-sidebar collapsible>
      <template #header="{ collapsed }">
        {{ collapsed ? "TH" : "TennisHistory" }}
      </template>

      <template #default="{ collapsed }">
        <!--Open command palette-->
        <u-dashboard-search-button
          :collapsed
          size="xs"
          label="Shortcuts"
        />

        <!--Internal links-->
        <u-navigation-menu
          :collapsed
          :items="NAV_LINKS"
          orientation="vertical"
          highlight
        />
      </template>

      <template #footer="{ collapsed }">
        <!--External links-->
        <u-navigation-menu
          :collapsed
          :items="RELATED_LINKS"
          orientation="vertical"
        />
      </template>
    </u-dashboard-sidebar>
    <slot />
  </u-dashboard-group>
</template>
