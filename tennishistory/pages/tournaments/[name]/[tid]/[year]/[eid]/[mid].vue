<script setup lang="ts">
definePageMeta({ name: "match" })
const route = useRoute()
const toast = useToast()
const { tname, year, eid, mid, tid } = route.params

const { data: match, status } = await useFetch<MatchType>("/api/matchDetails", {
  query: { mid, eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

useHead({ title: `${match.value?.p1.name} v. ${match.value?.p2.name} | ${match.value?.name ?? useChangeCase(tname as string, "capitalCase").value} ${year}` })

const links = computed(() => {
  if (match.value) {
    return [
      { label: match.value.p1.name, avatar: { src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p1.id}` }, to: { name: "player", params: { name: useChangeCase(match.value.p1.name, "kebabCase").value, id: match.value.p1.id } } },
      { label: match.value.p2.name, avatar: { src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p2.id}` }, to: { name: "player", params: { name: useChangeCase(match.value.p2.name, "kebabCase").value, id: match.value.p2.id } } },
      { label: "Tournament Details", icon: ICONS.trophy, to: { name: "tournament", params: { name: tname, tid } } },
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
      >
        <template #title>{{ match ? `${match.p1.name} v. ${match.p2.name}` : `${useChangeCase(tname as string, "capitalCase").value} ${year} ${mid}` }}</template>
        <template
          #description
          v-if="match"
        >
          {{ match.name }} {{ year }} — {{ match.round }}
        </template>
      </u-page-header>
    </ClientOnly>

    <u-page-body>
      <!--TODO: skeleton loader-->
      <u-container v-if="match">
        <match-details :match />

        <div>
          <div>Service Stats</div>
          <match-stats-panel
            :stats="match.service_stats"
            :p1_name="match.p1.name"
            :p2_name="match.p2.name"
            :p1_id="match.p1.id"
            :p2_id="match.p2.id"
          />
        </div>

        <div>
          <div>Return Stats</div>
          <match-stats-panel
            :stats="match.return"
            :p1_name="match.p1.name"
            :p2_name="match.p2.name"
            :p1_id="match.p1.id"
            :p2_id="match.p2.id"
          />
        </div>

        <div>
          <div>Points Stats</div>
          <match-stats-panel
            :stats="match.points.concat(match.points_extra)"
            :p1_name="match.p1.name"
            :p2_name="match.p2.name"
            :p1_id="match.p1.id"
            :p2_id="match.p2.id"
          />
        </div>

        <div v-if="match.service_speed">
          <div>Service Speed</div>
          <service-speed-panel
            :stats="match.service_speed"
            :p1_name="match.p1.name"
            :p2_name="match.p2.name"
            :p1_id="match.p1.id"
            :p2_id="match.p2.id"
          />
        </div>
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
