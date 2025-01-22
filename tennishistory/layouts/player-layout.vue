<script setup lang="ts">
import defaultLayout from "~/layouts/default.vue"
const route = useRoute()
const { name, id } = route.params

const { data: player } = await useFetch<PlayerName>("/api/playerName", { query: { id } })

const page = computed(() => {
  return PLAYER_PAGES.find(page => page.name === route.name) || null
})

const filteredLinks = computed(() => {
  return PLAYER_PAGES.filter(page => page.name !== route.name)
})

useHead({ title: `${page.value?.label} | ${player.value?.name ?? useChangeCase(name as string, "capitalCase").value}` })
</script>

<template>
  <default-layout>
    <u-page>
      <u-page-header
        headline="Players"
        :description="page?.label"
        :links="filteredLinks || PLAYER_PAGES"
        :title="player?.name ?? useChangeCase(name as string, 'capitalCase').value"
      />
      <u-page-body>
        <slot />
      </u-page-body>
    </u-page>
  </default-layout>
</template>
