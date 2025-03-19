<script setup lang="ts">
definePageMeta({
  name: "match",
  layout: "dashboard-layout"
})
const toast = useToast()
const formatName = useFormatName()
const mid = useRouteParams<string>("mid")
const eid = useRouteParams<string>("eid")
const tid = useRouteParams<string>("tid")
const year = useRouteParams<string>("year")
const name = useRouteParams<string>("name")
const checked = ref(false)

// API call
const { data: match } = await useFetch<MatchDetailsType>("/api/match-details", {
  query: { mid, eid },
  transform: data => {
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        if (value.some(item => item === null)) {
          delete (data as any)[key]
        } else {
          // @ts-ignore
          ;(data as any)[key] = value.map(item => item.low)
        }
      }
    }
    return data
  },
  onResponseError: () => {
    toast.add({
      title: `Error fetching details for ${useChangeCase(name.value, "capitalCase").value} ${year.value} ${mid.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

provide("p1Name", match.value?.p1.name)
provide("p2Name", match.value?.p2.name)
provide("p1Id", match.value?.p1.id)
provide("p2Id", match.value?.p2.id)

formatName.name.value = match.value?.name ?? name.value
useHead({
  title: match.value ? `${match.value.p1.name} v. ${match.value.p2.name}` : `${formatName.capitaliseName.value} ${year.value}`,
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
          value: [match.value?.serve1[0]! + match.value?.serve2[0]!, match.value?.serve1[1]! + match.value?.serve2[1]!, match.value?.serve1[2]! + match.value?.serve2[2]!, match.value?.serve1[3]! + match.value?.serve2[3]!]
        })
      } else if (stat.label === "Return points won") {
        acc.push({
          ...stat,
          value: [match.value?.ret1[0]! + match.value?.ret2[0]!, match.value?.ret1[1]! + match.value?.ret2[1]!, match.value?.ret1[2]! + match.value?.ret2[2]!, match.value?.ret1[3]! + match.value?.ret2[3]!]
        })
      } else if (stat.label === "Total points won") {
        acc.push({
          ...stat,
          value: [match.value?.serve1[0]! + match.value?.serve2[0]! + match.value?.ret1[0]! + match.value?.ret2[0]!, match.value?.serve1[1]! + match.value?.serve2[1]! + match.value?.ret1[1]! + match.value?.ret2[1]!, match.value?.serve1[2]! + match.value?.serve2[2]! + match.value?.ret1[2]! + match.value?.ret2[2]!, match.value?.serve1[3]! + match.value?.serve2[3]! + match.value?.ret1[3]! + match.value?.ret2[3]!]
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
const items = computed(() => [{ label: "Tournaments", to: { name: "tournaments" } }, { label: match.value?.name ?? formatName.capitaliseName.value, to: { name: "tournament", params: { name: name.value, tid: tid.value } } }, { label: year.value, to: { name: "event", params: { name: name.value, tid: tid.value, year: year.value, eid: eid.value } } }, { label: match.value ? `${match.value.p1.name} v. ${match.value.p2.name}` : mid.value }])

// Related links
const links = computed(() => {
  if (match.value) {
    return [
      // Player links
      {
        label: match.value.p1.name,
        avatar: {
          src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p1.id}`
        },
        to: {
          name: "player",
          params: {
            name: useChangeCase(match.value.p1.name, "kebabCase").value,
            id: match.value.p1.id
          }
        }
      },
      {
        label: match.value.p2.name,
        avatar: {
          src: `https://www.atptour.com/-/media/alias/player-headshot/${match.value.p2.id}`
        },
        to: {
          name: "player",
          params: {
            name: useChangeCase(match.value.p2.name, "kebabCase").value,
            id: match.value.p2.id
          }
        }
      },
      // Head to head link
      {
        label: "H2H",
        icon: ICONS.swords,
        to: {
          name: "h2h-players",
          params: {
            p1Id: match.value.p1.id,
            p2Id: match.value.p2.id,
            p1Name: useChangeCase(match.value.p1.name, "kebabCase").value,
            p2Name: useChangeCase(match.value.p2.name, "kebabCase").value
          }
        }
      }
    ]
  }
  return []
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
              :icon="link.icon"
              :avatar="link.avatar"
            />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <template #right>
            <u-switch
              v-model="checked"
              :checked-icon="ICONS.table"
              :unchecked-icon="ICONS['bar-chart']"
              :label="checked ? 'Table view' : 'Chart view'"
            />
          </template>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-header
          headline="Matches"
          :title="match ? `${match.p1.name} v. ${match.p2.name}` : `${formatName.capitaliseName.value} ${year} ${mid}`"
          :description="`${match?.name} ${year} — ${match?.round}`"
        />

        <div v-if="match">
          <match-details :match />

          <div
            v-if="compoundedStats"
            class="gap-5"
            :class="checked ? 'grid grid-cols-1 md:grid-cols-2' : 'flex flex-col'"
          >
            <match-stats-panel
              v-if="compoundedStats.serviceStats.length > 0"
              :stats="compoundedStats.serviceStats"
              title="Service Stats"
              :checked
            />

            <match-stats-panel
              v-if="compoundedStats.returnStats.length > 0"
              :stats="compoundedStats.returnStats"
              title="Return Stats"
              :checked
            />

            <match-stats-panel
              v-if="compoundedStats.pointStats.length > 0"
              :stats="compoundedStats.pointStats"
              title="Points Stats"
              :checked
            />

            <service-speed-panel
              v-if="compoundedStats.serviceSpeed.length > 0"
              :stats="compoundedStats.serviceSpeed"
              :checked
            />
          </div>
        </div>

        <error-message
          v-else
          :icon="ICONS['no-chart']"
          :title="`No match stats available for ${formatName.capitaliseName.value} ${year} ${mid}`"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
