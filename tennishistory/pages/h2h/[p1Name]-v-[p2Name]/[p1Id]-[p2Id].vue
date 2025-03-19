<script setup lang="ts">
definePageMeta({
  name: "h2h-players",
  layout: "dashboard-layout"
})
const p1Name = useRouteParams<string>("p1Name")
const p2Name = useRouteParams<string>("p2Name")
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
const toast = useToast()
const formatName = useFormatName()

// API calls
const { data: h2h } = await useFetch<{ p1: H2HPlayerType; p2: H2HPlayerType }>("/api/h2h", {
  query: { p1Id, p2Id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching head to head for ${formatName.capitaliseName.value} v. ${formatName.capitaliseName2.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

const { data: matches } = await useFetch<H2HMatchType[]>("/api/h2h-matches", {
  query: { p1Id, p2Id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching matches for ${formatName.capitaliseName.value} v. ${formatName.capitaliseName2.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

formatName.name.value = h2h.value?.p1.name ?? p1Name.value
formatName.name2.value = h2h.value?.p2.name ?? p2Name.value
useHead({
  title: "H2H",
  templateParams: { subPage: `${h2h.value?.p1.name ?? formatName.capitaliseName.value} v. ${h2h.value?.p2.name ?? formatName.capitaliseName2.value}` }
})

// Breadcrumbs
const items = computed(() => [{ label: "Head to Head" }, { label: `${h2h.value?.p1.name ?? formatName.capitaliseName.value} v. ${h2h.value?.p2.name ?? formatName.capitaliseName2.value}` }])

// Relevant links
const links = computed(() => [
  {
    label: h2h.value?.p1.name ?? formatName.capitaliseName.value,
    to: { name: "player", params: { name: p1Name.value, id: p1Id.value } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${p1Id.value}`,
      class: "border border-neutral-400"
    }
  },
  {
    label: h2h.value?.p2.name ?? formatName.capitaliseName2.value,
    to: { name: "player", params: { name: p2Name.value, id: p2Id.value } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${p2Id.value}`,
      class: "border border-neutral-400"
    }
  }
])

const winLoss = computed(() => {
  if (matches.value) {
    const totalMatches = matches.value.length
    const p1Wins = matches.value.filter(match => match.winner === p1Id.value).length
    return [p1Wins, totalMatches - p1Wins]
  }
  return [0, 0]
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel class="max-h-screen">
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>
          <template #title>
            <u-breadcrumb :items />
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
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <player-search
            :index="1"
            :name="h2h?.p1.name ?? formatName.capitaliseName.value"
            :country="h2h?.p1.country ?? { id: '', name: '', alpha2: null }"
          />
          <player-search
            :index="2"
            :name="h2h?.p2.name ?? formatName.capitaliseName2.value"
            :country="h2h?.p2.country ?? { id: '', name: '', alpha2: null }"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-header
          v-if="h2h"
          headline="Head to Head"
          :title="`${h2h.p1.name} v. ${h2h.p2.name}`"
        />
        <div
          v-if="h2h"
          class="flex gap-10 justify-center"
        >
          <h2h-player-card
            :player="h2h.p1"
            :id="p1Id"
            :index="1"
          />
          <div class="flex flex-col items-center flex-1">
            <doughnut-chart
              v-if="matches"
              :winLoss
            />
            <h2h-table :h2h />
          </div>
          <h2h-player-card
            :player="h2h.p2"
            :id="p2Id"
            :index="2"
          />
        </div>
        <error-message
          v-else
          :icon="ICONS['no-swords']"
          :title="`No head to head found for ${formatName.capitaliseName.value} v. ${formatName.capitaliseName2.value}`"
        />
        <match-table
          v-if="matches && h2h"
          :p1Name="h2h?.p1.name ?? formatName.capitaliseName.value"
          :p1Id
          :p1Country="h2h?.p1.country"
          :p2Name="h2h?.p2.name ?? formatName.capitaliseName2.value"
          :p2Id
          :p2Country="h2h?.p2.country"
          :matches
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
