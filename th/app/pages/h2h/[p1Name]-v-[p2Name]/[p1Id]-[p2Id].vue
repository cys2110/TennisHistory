<script setup lang="ts">
import { type DropdownMenuItem } from "@nuxt/ui"

definePageMeta({ name: "h2h-players" })
const {
  params: { p1Id, p2Id, p1Name, p2Name }
} = useRoute("h2h-players")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

// API call
const { data: h2h } = await useFetch<{ p1: PlayerInterface; p2: PlayerInterface; p1Wins: number; p2Wins: number }>("/api/h2h/players", {
  query: { p1Id, p2Id },
  server: false
})

useHead({
  title: () =>
    `${h2h.value ? `${get(h2h)?.p1.first_name} ${get(h2h)?.p1.last_name}` : capitalCase(p1Name as string)} v ${h2h.value ? `${get(h2h)?.p2.first_name} ${get(h2h)?.p2.last_name}` : capitalCase(p2Name as string)}`
})

// Related links
const links = computed<DropdownMenuItem[]>(
  () =>
    [
      {
        label: h2h.value ? `${get(h2h)?.p1.first_name} ${get(h2h)?.p1.last_name}` : capitalCase(p1Name as string),
        to: { name: "player", params: { name: p1Name, id: p1Id } },
        color: h2h.value ? get(h2h)?.p1.tour : "ATP",
        icon: icons.player
      },
      {
        label: h2h.value ? `${get(h2h)?.p2.first_name} ${get(h2h)?.p2.last_name}` : capitalCase(p2Name as string),
        to: { name: "player", params: { name: p2Name, id: p2Id } },
        color: h2h.value ? get(h2h)?.p2.tour : "ATP",
        icon: icons.player
      }
    ] as DropdownMenuItem[]
)
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <u-dropdown-menu :items="links">
              <u-button
                :icon="uIcons.ellipsis"
                variant="link"
                :ui="{ leadingIcon: 'rotate-90' }"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar v-if="h2h">
          <h2h-player-search
            :index="1"
            :player="h2h.p1"
          />
          <h2h-player-search
            :index="2"
            :player="h2h.p2"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <h2h-wl-chart
          v-if="h2h"
          :p1Wins="h2h.p1Wins"
          :p2Wins="h2h.p2Wins"
        />

        <h2h-details
          v-if="h2h"
          :h2h
        />

        <h2h-matches
          v-if="h2h"
          :h2h
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
