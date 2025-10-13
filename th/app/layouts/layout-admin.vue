<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const {
  ui: { icons }
} = useAppConfig()

const navLinks: NavigationMenuItem[] = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "admin-tournaments" }, icon: ICONS.tournament },
  { label: "Events", to: { name: "admin-events" }, icon: ICONS.event },
  { label: "Players", to: { name: "admin-players" }, icon: ICONS.player },
  { label: "Coaches", to: { name: "admin-coaches" }, icon: ICONS.coach },
  { label: "Umpires", to: { name: "admin-umpires" }, icon: ICONS.umpire },
  { label: "Supervisors", to: { name: "admin-supervisors" }, icon: ICONS.supervisor },
  { label: "Merge Nodes", to: { name: "admin-merge-nodes" }, icon: ICONS.merge }
]
</script>

<template>
  <u-dashboard-group>
    <u-dashboard-search />

    <u-dashboard-sidebar collapsible>
      <template #header="{ collapsed }"> {{ collapsed ? "TH" : "Tennis History" }}</template>

      <template #default="{ collapsed }">
        <u-dashboard-search-button
          size="sm"
          :collapsed
          :kbds="[]"
          :icon="icons.search"
        />
        <u-navigation-menu
          :collapsed
          :items="navLinks"
          tooltip
          orientation="vertical"
          variant="link"
        />
      </template>
    </u-dashboard-sidebar>

    <slot />
  </u-dashboard-group>
</template>
