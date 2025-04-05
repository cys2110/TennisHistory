<script setup lang="ts">
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
    <u-dashboard-search />

    <u-dashboard-sidebar collapsible>
      <template #header="{ collapsed }">
        {{ collapsed ? "TH" : "TennisHistory" }}
      </template>

      <template #default="{ collapsed }">
        <u-dashboard-search-button :collapsed />

        <!--Internal links-->
        <u-navigation-menu
          :collapsed
          :items="NAV_LINKS"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <!--External links-->
        <u-navigation-menu
          :collapsed
          :items="RELATED_LINKS"
          orientation="vertical"
          class="w-full"
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
            #right
            v-if="$slots.right"
          >
            <slot name="right" />
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar v-if="$slots.toolbar || $slots['toolbar-left'] || $slots['toolbar-right']">
          <template #left>
            <slot name="toolbar-left" />
          </template>
          <template #right>
            <slot name="toolbar-right" />
          </template>
          <slot name="toolbar" />
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <slot />
      </template>
    </u-dashboard-panel>
  </u-dashboard-group>
</template>
