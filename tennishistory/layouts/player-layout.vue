<script setup lang="ts">
// @ts-nocheck
import defaultLayout from "~/layouts/default.vue"
import usePlayerName from "~/stores/usePlayerName"
const name = useRouteParams<string>("name")
const id = useRouteParams<string>("id")
const route = useRoute()
const playerName = usePlayerName()

// API call
const { data: player } = await useFetch<PlayerName>("/api/playerName", { query: { id: id.value } })
playerName.playerName = player.value?.name ?? name.value // Set player name in store

// Filter player pages
const page = computed(() => {
  const filteredPage = PLAYER_PAGES.find(page => page.name === route.name) || null
  const filteredLinks = PLAYER_PAGES.filter(page => page.name !== route.name)
  return { page: filteredPage, links: filteredLinks }
})

useHead({ title: `${page.value?.label} | ${playerName.capitalisedName}` })
</script>

<template>
  <default-layout>
    <u-page>
      <u-page-header
        headline="Players"
        :description="page?.page.label"
        :links="page?.links || PLAYER_PAGES"
        :title="playerName.capitalisedName"
      />
      <u-page-body>
        <slot />
      </u-page-body>
    </u-page>
  </default-layout>
</template>
