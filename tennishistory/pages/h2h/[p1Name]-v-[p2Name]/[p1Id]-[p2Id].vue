<script setup lang="ts">
definePageMeta({ name: "h2h-page" })
const route = useRoute()
const toast = useToast()

const { data: h2h, status } = await useFetch<H2H>("/api/h2h", {
  query: { p1Id: route.params.p1Id, p2Id: route.params.p2Id },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

const links = [
  {
    label: h2h.value?.p1.name ?? (route.params.p1Name as string),
    to: { name: "player", params: { name: route.params.p1Name, id: route.params.p1Id } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${route.params.p1Id}`
    }
  },
  {
    label: h2h.value?.p2.name ?? (route.params.p2Name as string),
    to: { name: "player", params: { name: route.params.p2Name, id: route.params.p2Id } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${route.params.p2Id}`
    }
  }
]

const winLoss = computed(() => {
  if (h2h.value) {
    const totalMatches = h2h.value.matches.length
    const p1Wins = h2h.value.matches.filter(match => match.winner === route.params.p1Id).length
    return [p1Wins, totalMatches - p1Wins]
  }
  return [0, 0]
})
</script>

<template>
  <u-page>
    <u-page-header
      headline="Head to Head"
      :links="links"
    >
      <template #title>{{ h2h?.p1.name ?? useChangeCase(route.params.p1Name as string, "capitalCase").value }} v. {{ h2h?.p2.name ?? useChangeCase(route.params.p2Name as string, "capitalCase").value }}</template>
    </u-page-header>

    <u-page-body>
      <template v-if="h2h">
        <u-page-columns>
          <h2h-player-card
            :player="h2h.p1"
            :index="1"
          />
          <div>
            <h2h-doughnut-chart :win-loss />
            <h2h-table :h2h />
          </div>
          <h2h-player-card
            :player="h2h.p2"
            :index="2"
          />
        </u-page-columns>
        <h2h-match-table :matches="h2h.matches" />
      </template>
      <error-message
        v-else
        :icon="ICONS['no-swords']"
      >
        No head to head available
      </error-message>
    </u-page-body>
  </u-page>
</template>
