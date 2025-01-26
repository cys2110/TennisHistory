<script setup lang="ts">
// @ts-nocheck
definePageMeta({ name: "match" })
const mid = useRouteParams<string>("mid")
const eid = useRouteParams<string>("eid")
const tid = useRouteParams<string>("tid")
const year = useRouteParams<string>("year")
const tname = useRouteParams<string>("name")
const toast = useToast()
const tournamentName = useTournamentName()

// API call
const { data: match, status } = await useFetch<MatchType>("/api/matchDetails", {
  query: { mid, eid },
  transform: data => {
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        data[key] = value.map(item => {
          return {
            ...item,
            values: item.values.map(val => val.low)
          }
        })
      }
    }
    return data
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching match data",
      icon: ICONS.error,
      description: error?.message
    })
  }
})
tournamentName.tournamentName = match.value?.name ?? tname.value
useHead({ title: `${match.value?.p1.name} v. ${match.value?.p2.name} | ${tournamentName.capitalisedName} ${year.value}` })

// Provide to grandchildren components
provide("p1Name", match.value?.p1.name)
provide("p2Name", match.value?.p2.name)
provide("p1Id", match.value?.p1.id)
provide("p2Id", match.value?.p2.id)

// Header links
const links = computed(() => {
  if (match.value) {
    return [
      { label: match.value.p1.name, avatar: { src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p1.id}`, class: "border border-slate-500" }, to: { name: "player", params: { name: useChangeCase(match.value.p1.name, "kebabCase").value, id: match.value.p1.id } }, color: "secondary", variant: "subtle" },
      { label: match.value.p2.name, avatar: { src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p2.id}`, class: "border border-slate-500" }, to: { name: "player", params: { name: useChangeCase(match.value.p2.name, "kebabCase").value, id: match.value.p2.id } }, color: "secondary", variant: "subtle" },
      { label: "H2H", icon: ICONS.swords, to: { name: "h2h-page", params: { p1Id: match.value.p1.id, p2Id: match.value.p2.id, p1Name: useChangeCase(match.value.p1.name, "kebabCase").value, p2Name: useChangeCase(match.value.p2.name, "kebabCase").value } }, color: "secondary", variant: "subtle" },
      { label: "Tournament Details", icon: ICONS.trophy, to: { name: "tournament", params: { name: tname.value, tid } }, color: "secondary", variant: "subtle" },
      ...EVENT_PAGES
    ]
  }
  return []
})
</script>

<template>
  <u-page>
    <ClientOnly>
      <u-page-header
        headline="Matches"
        :links
        :description="`${match?.name} ${year} — ${match?.round}`"
      >
        <template #title>{{ match ? `${match.p1.name} v. ${match.p2.name}` : `${tournamentName.capitalisedName} ${year} ${mid}` }}</template>
      </u-page-header>
    </ClientOnly>

    <u-page-body>
      <!--TODO: skeleton loader-->
      <u-container v-if="match">
        <match-details :match />

        <match-stats-panel
          :stats="match.service_stats"
          title="Service Stats"
        />

        <match-stats-panel
          :stats="match.return"
          title="Return Stats"
        />

        <match-stats-panel
          :stats="match.points"
          title="Points Stats"
        />

        <service-speed-panel
          v-if="match.service_speed"
          :stats="match.service_speed"
        />
      </u-container>
      <error-message
        v-else
        :icon="ICONS['no-info']"
      >
        No match stats available
      </error-message>
    </u-page-body>
  </u-page>
</template>
