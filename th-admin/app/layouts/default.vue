<script setup>
const id = ref("Enter ID")

const items = [
  [
    { label: "Home", to: "/", icon: "line-md:home-md-twotone" },
    { label: "Tournaments", to: { name: "tournaments" }, icon: "game-icons:trophy" },
    { label: "Events", to: { name: "events" }, icon: "solar:calendar-mark-bold-duotone" },
    { label: "Players", to: { name: "players" }, icon: "map:stadium" },
    { label: "Coaches", to: { name: "coaches" }, icon: "game-icons:tennis-racket" },
    { label: "Supervisors", to: { name: "supervisors" }, icon: "line-md:clipboard-list-twotone" },
    { label: "Umpires", to: { name: "umpires" }, icon: "game-icons:whistle" },
    { label: "Merge Nodes", to: { name: "merge-nodes" }, icon: "game-icons:join" }
  ]
]

const groups = computed(() => [
  {
    id: "pages",
    label: "Edit",
    items: [
      {
        label: "Edit Event",
        to: { name: "event", params: { id: id.value } }
      },
      {
        label: "Edit Player",
        to: { name: "player", params: { id: id.value } }
      }
    ]
  }
])
</script>

<template>
  <u-dashboard-group>
    <u-dashboard-search :groups>
      <template #footer>
        <u-input
          v-model="id"
          class="my-5 mx-6 min-w-2xl"
          placeholder="Enter ID for edit pages"
        />
      </template>
    </u-dashboard-search>

    <u-dashboard-sidebar collapsible>
      <template #default="{ collapsed }">
        <u-dashboard-search-button :collapsed />
        <u-navigation-menu
          :collapsed
          :items="items[0]"
          tooltip
          orientation="vertical"
          variant="link"
        />
      </template>
    </u-dashboard-sidebar>
    <slot />
  </u-dashboard-group>
</template>
