<script setup lang="ts">
definePageMeta({ name: "match" })
const toast = useToast()
const name = useRouteParams<string>("name")
const id = useRouteParams<string>("id")
const year = useRouteParams<string>("year")
const eid = useRouteParams<string>("eid")
const mid = useRouteParams<string>("mid")
const checked = ref(false)

// API call
const { data: match, status } = await useFetch<MatchDetailsType>("/api/match-details", {
  query: { mid, eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching details for ${decodeName(name.value)} ${year.value} ${mid.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

useHead({
  title: match.value ? `${match.value.p1.name} v. ${match.value.p2.name}` : `${decodeName(name.value)} ${year.value}`,
  templateParams: {
    subPage: match.value ? `${match.value.name} ${year.value}` : null
  }
})

const compoundedStats = computed(() => {
  if (match.value) {
    const serviceStats = MATCH_STATS.service.reduce((acc, stat) => {
      const keyExists = (match.value as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      } else if (stat.label === "First serve") {
        acc.push({
          ...stat,
          value: [match.value?.serve1[1], match.value?.serve1[1]! + match.value?.serve2[1]!, match.value?.serve1[3], match.value?.serve1[3]! + match.value?.serve2[3]!]
        })
      }
      return acc
    }, [] as any)

    const returnStats = MATCH_STATS.return.reduce((acc, stat) => {
      const keyExists = (match.value as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      }
      return acc
    }, [] as any)

    const pointStats = MATCH_STATS.points.reduce((acc, stat) => {
      const keyExists = (match.value as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      } else if (stat.label === "Service points won") {
        acc.push({
          ...stat,
          value: [
            match.value?.serve1[0]! + match.value?.serve2[0]!,
            match.value?.serve1[1]! + match.value?.serve2[1]!,
            match.value?.serve1[2]! + match.value?.serve2[2]!,
            match.value?.serve1[3]! + match.value?.serve2[3]!
          ]
        })
      } else if (stat.label === "Return points won") {
        acc.push({
          ...stat,
          value: [
            match.value?.ret1[0]! + match.value?.ret2[0]!,
            match.value?.ret1[1]! + match.value?.ret2[1]!,
            match.value?.ret1[2]! + match.value?.ret2[2]!,
            match.value?.ret1[3]! + match.value?.ret2[3]!
          ]
        })
      } else if (stat.label === "Total points won") {
        acc.push({
          ...stat,
          value: [
            match.value?.serve1[0]! + match.value?.serve2[0]! + match.value?.ret1[0]! + match.value?.ret2[0]!,
            match.value?.serve1[1]! + match.value?.serve2[1]! + match.value?.ret1[1]! + match.value?.ret2[1]!,
            match.value?.serve1[2]! + match.value?.serve2[2]! + match.value?.ret1[2]! + match.value?.ret2[2]!,
            match.value?.serve1[3]! + match.value?.serve2[3]! + match.value?.ret1[3]! + match.value?.ret2[3]!
          ]
        })
      }
      return acc
    }, [] as any)

    const serviceSpeed = MATCH_STATS.service_speed.reduce((acc, stat) => {
      const keyExists = (match.value as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      }
      return acc
    }, [] as any)
    return { serviceStats, returnStats, pointStats, serviceSpeed }
  }
  return null
})

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: decodeName(name.value), to: { name: "tournament", params: { name: name.value, id: id.value } } },
  { label: year.value, to: { name: "event", params: { name: name.value, id: id.value, year: year.value, eid: eid.value } } },
  { label: match.value ? match.value.round : "Loading..." },
  { label: match.value ? `${match.value.p1.name} v. ${match.value.p2.name}` : mid.value }
])

// Related links
const links = computed(() => {
  if (match.value) {
    return [
      // Player links
      {
        label: match.value.p1.name,
        avatar: {
          src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p1.id}`,
          icon: ICONS.player,
          class: "border border-neutral-400"
        },
        to: { name: "player", params: { name: encodeName(match.value.p1.name), id: match.value.p1.id } }
      },
      {
        label: match.value.p2.name,
        avatar: {
          src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p2.id}`,
          icon: ICONS.player,
          class: "border border-neutral-400"
        },
        to: { name: "player", params: { name: encodeName(match.value.p2.name), id: match.value.p2.id } }
      },
      // Head to head link
      {
        label: "H2H",
        icon: ICONS.h2h,
        to: { name: "h2h-players", params: { p1Name: encodeName(match.value.p1.name), p2Name: encodeName(match.value.p2.name), p1Id: match.value.p1.id, p2Id: match.value.p2.id } }
      }
    ]
  }
  return []
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>
      <template #right>
        <u-button
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :label="link.label"
          :icon="link.icon"
          :avatar="link.avatar"
        />
      </template>
      <template #toolbar-right>
        <u-switch
          v-model="checked"
          :checked-icon="ICONS.table"
          :unchecked-icon="ICONS.barChart"
          :label="checked ? 'Table view' : 'Chart view'"
        />
      </template>

      <match-details
        v-if="match"
        :match
      />

      <div
        v-if="match && compoundedStats"
        :class="checked ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'flex flex-col'"
      >
        <match-stats-panel
          v-if="compoundedStats.serviceStats.length > 0"
          :stats="compoundedStats.serviceStats"
          title="Service Stats"
          :checked
          :p1="{ name: match.p1.name, id: match.p1.id, country: match.p1.country }"
          :p2="{ name: match.p2.name, id: match.p2.id, country: match.p2.country }"
        />

        <match-stats-panel
          v-if="compoundedStats.returnStats.length > 0"
          :stats="compoundedStats.returnStats"
          title="Return Stats"
          :checked
          :p1="{ name: match.p1.name, id: match.p1.id, country: match.p1.country }"
          :p2="{ name: match.p2.name, id: match.p2.id, country: match.p2.country }"
        />

        <match-stats-panel
          v-if="compoundedStats.pointStats.length > 0"
          :stats="compoundedStats.pointStats"
          title="Points Stats"
          :checked
          :p1="{ name: match.p1.name, id: match.p1.id, country: match.p1.country }"
          :p2="{ name: match.p2.name, id: match.p2.id, country: match.p2.country }"
        />

        <service-speed-panel
          v-if="compoundedStats.serviceSpeed.length > 0"
          :stats="compoundedStats.serviceSpeed"
          :checked
          :p1="{ name: match.p1.name, id: match.p1.id, country: match.p1.country }"
          :p2="{ name: match.p2.name, id: match.p2.id, country: match.p2.country }"
        />
      </div>
      <error-message
        v-else
        :icon="ICONS.noChart"
        :title="`No match stats available for ${decodeName(name)} ${year} ${mid}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
