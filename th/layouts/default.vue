<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind)
const xlAndUp = breakpoints.greaterOrEqual("xl")

// Show submenus in command palette
const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: NAV_LINKS.flatMap(group => (group.children ? group.children : group))
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
          :size="xlAndUp ? 'sm' : 'xs'"
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
