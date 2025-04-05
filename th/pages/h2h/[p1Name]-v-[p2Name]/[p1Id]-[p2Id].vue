<script setup lang="ts">
definePageMeta({ name: "h2h-players" })
const p1ParamName = useRouteParams<string>("p1Name")
const p1Name = computed(() => decodeName(p1ParamName.value))
const p2ParamName = useRouteParams<string>("p2Name")
const p2Name = computed(() => decodeName(p2ParamName.value))
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
useHead({ title: `${p1Name.value} v. ${p2Name.value}`, templateParams: { subPage: "H2H" } })
const toast = useToast()

interface H2HCountry {
  id: string
  name: string
  alpha2: string
}

// API call
const { data: h2h } = await useFetch<{ p1: H2HCountry; p2: H2HCountry }>("/api/h2h-countries", {
  query: { p1Id, p2Id },
  onResponseError: () => {
    toast.add({
      title: "Error",
      description: `Failed to fetch head to head between ${p1Name.value} and ${p2Name.value}`,
      icon: ICONS.error
    })
  }
})

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.h2h },
  { slot: "players" as const, label: `${p1Name.value} v. ${p2Name.value}` }
]

// Related links
const links = computed(() => [
  {
    label: p1Name.value,
    to: { name: "player", params: { name: p1ParamName.value, id: p1Id.value } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${p1Id.value}`,
      icon: ICONS.player,
      class: "border border-neutral-400"
    }
  },
  {
    label: p2Name.value,
    to: { name: "player", params: { name: p2ParamName.value, id: p2Id.value } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${p2Id.value}`,
      icon: ICONS.player,
      class: "border border-neutral-400"
    }
  }
])
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items>
          <template #players-leading>
            <u-avatar
              :src="`https://www.atptour.com/-/media/alias/player-headshot/${p1Id}`"
              :icon="ICONS.player"
              class="border border-neutral-400"
            />
          </template>
          <template #players-trailing>
            <u-avatar
              :src="`https://www.atptour.com/-/media/alias/player-headshot/${p2Id}`"
              :icon="ICONS.player"
              class="border border-neutral-400"
            />
          </template>
        </u-breadcrumb>
      </template>

      <template #right>
        <u-button
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :label="link.label"
          :avatar="link.avatar"
        />
      </template>

      <template #toolbar-left>
        <player-search
          v-if="h2h"
          :index="1"
          :country="h2h?.p1"
        />
      </template>

      <template #toolbar-right>
        <player-search
          v-if="h2h"
          :index="2"
          :country="h2h?.p2"
        />
      </template>

      <h2h-details
        v-if="h2h"
        :c1="h2h.p1"
        :c2="h2h.p2"
      />

      <match-table
        v-if="h2h"
        :c1="h2h.p1"
        :c2="h2h.p2"
      />
    </nuxt-layout>
  </div>
</template>
