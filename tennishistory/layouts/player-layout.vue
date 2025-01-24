<script setup lang="ts">
import defaultLayout from "~/layouts/default.vue"
const name = useRouteParams<string>("name")
const id = useRouteParams<string>("id")
const route = useRoute()

const { data: player } = await useFetch<PlayerName>("/api/playerName", { query: { id: id.value } })

const page = computed(() => {
  return PLAYER_PAGES.find(page => page.name === route.name) || null
})

const filteredLinks = computed(() => {
  return PLAYER_PAGES.filter(page => page.name !== route.name)
})

useHead({ title: `${page.value?.label} | ${player.value?.name ?? useChangeCase(name.value, "capitalCase").value}` })
</script>

<template>
  <default-layout>
    <u-page>
      <u-page-header
        headline="Players"
        :description="page?.label"
        :links="filteredLinks || PLAYER_PAGES"
        :title="player?.name ?? useChangeCase(name, 'capitalCase').value"
      />
      <u-page-body>
        <slot />
      </u-page-body>
    </u-page>
  </default-layout>
</template>
