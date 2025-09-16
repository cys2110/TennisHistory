<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

const navLinks: NavigationMenuItem[] = [
  {
    label: "Tournaments",
    icon: icons.tournament,
    to: { name: "tournaments" },
    defaultOpen: true,
    children: [{ label: "Results Archive", to: { name: "results-archive" }, icon: icons.event }]
  },
  {
    label: "Players",
    icon: icons.player,
    defaultOpen: true,
    to: { name: "players" },
    children: [{ label: "Head to Head", to: { name: "h2h" }, icon: icons.h2h }]
  },
  { label: "Stats/Records", to: { name: "statistics-and-records" }, icon: icons.stats },
  {
    label: "Other",
    icon: "tabler:grid-dots",
    defaultOpen: true,
    children: [
      { label: "Categories", to: { name: "categories" }, icon: icons.categories },
      { label: "Coaches", to: { name: "coaches" }, icon: icons.coach },
      { label: "Countries", to: { name: "countries" }, icon: icons.countries },
      { label: "Supervisors", to: { name: "supervisors" }, icon: icons.supervisor },
      { label: "Surfaces", to: { name: "surfaces" }, icon: icons.court },
      { label: "Umpires", to: { name: "umpires" }, icon: icons.umpire },
      { label: "Venues", to: { name: "venues" }, icon: icons.venue },
      { label: "Years", to: { name: "years" }, icon: icons.year }
    ]
  },
  {
    label: "About",
    icon: uIcons.info,
    defaultOpen: true,
    to: { name: "about" },
    children: [{ label: "Ranking Rules", to: { name: "ranking-rules" }, icon: icons.seeds }]
  }
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
      <u-button
        :to="{ name: 'search' }"
        :icon="uIcons.search"
        size="sm"
        variant="ghost"
        color="neutral"
      />
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
