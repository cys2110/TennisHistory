<script setup lang="ts">
const { viewMode } = useViewMode()

const groups = computed(() => [
  {
    id: "viewMode",
    label: "View mode",
    items: [
      {
        label: "Cards",
        suffix: "View data in cards mode",
        icon: ICONS.cards,
        onSelect() {
          viewMode.value = "cards"
        }
      },
      {
        label: "List",
        suffix: "View data in list mode",
        icon: ICONS.list,
        onSelect() {
          viewMode.value = "list"
        }
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
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <slot name="title" />
          </template>

          <template
            #trailing
            v-if="$slots.trailing"
          >
            <slot name="trailing" />
          </template>

          <template
            #right
            v-if="$slots.right"
          >
            <slot name="right" />
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar v-if="$slots.toolbar">
          <slot name="toolbar" />
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <slot />
      </template>
    </u-dashboard-panel>
  </u-dashboard-group>
</template>
