<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const id = ref<string>("")

const items: NavigationMenuItem[][] = [
  [
    { label: "Home", to: "/" },
    { label: "Tournaments", to: { name: "tournaments" } },
    { label: "Events", to: { name: "events" } },
    { label: "Players", to: { name: "players" } },
    { label: "Coaches", to: { name: "coaches" } },
    { label: "Supervisors", to: { name: "supervisors" } },
    { label: "Umpires", to: { name: "umpires" } }
  ]
]

const groups = computed(() => [
  {
    id: "pages",
    label: "Edit",
    items: [
      {
        label: "Edit Event",
        to: { name: "edit-event", query: { id: get(id) } }
      },
      {
        label: "Edit Player",
        to: { name: "edit-player", query: { id: get(id) } }
      }
    ]
  }
])
</script>

<template>
  <u-dashboard-group>
    <u-dashboard-search
      v-model:search-term="id"
      :groups
    >
      <template #footer>
        <u-input
          v-model="id"
          class="my-5 mx-6 min-w-2xl"
          placeholder="Enter ID for edit pages"
        />
      </template>
    </u-dashboard-search>

    <u-dashboard-sidebar>
      <template #default>
        <u-dashboard-search-button />
        <u-navigation-menu
          :items="items[0]"
          orientation="vertical"
        />
      </template>
    </u-dashboard-sidebar>
    <slot />
  </u-dashboard-group>
</template>
