<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const {
  ui: { icons }
} = useAppConfig()

const navLinks: NavigationMenuItem[] = [
  { label: "Results Archive", to: { name: "results-archive" }, icon: ICONS.event },
  { label: "Tournaments", icon: ICONS.tournament, to: { name: "tournaments" } },
  { label: "Players", icon: ICONS.player, to: { name: "players" } },
  { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.h2h },
  { label: "Stats/Records", to: { name: "statistics-and-records" }, icon: ICONS.stats },
  { label: "Countries", to: { name: "countries" }, icon: ICONS.countries },
  { label: "Years", to: { name: "years" }, icon: ICONS.year },
  { label: "About", icon: icons.info, to: { name: "about" } }
]
</script>

<template>
  <u-header
    title="Tennis History"
    mode="drawer"
  >
    <u-navigation-menu
      :items="navLinks"
      color="primary"
      highlight
      highlight-color="primary"
      variant="link"
      content-orientation="vertical"
    />

    <template #right>
      <u-color-mode-button />
      <!-- <u-button
        :to="{ name: 'search' }"
        :icon="icons.search"
        size="sm"
        variant="ghost"
        color="neutral"
      /> -->
    </template>

    <template #body>
      <u-navigation-menu
        :items="navLinks"
        orientation="vertical"
        highlight
        highlight-color="primary"
      />
    </template>
  </u-header>
</template>
