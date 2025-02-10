<script setup lang="ts">
definePageMeta({ name: "match" })
const toast = useToast()
const mid = useRouteParams<string>("mid")
const eid = useRouteParams<string>("eid")
const tid = useRouteParams<string>("tid")
const year = useRouteParams<string>("year")
const name = useRouteParams<string>("name")
const formatName = useFormatName()

// API call
const { data: match } = await useFetch<MatchDetails>("/api/matchDetails", {
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
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching match data",
      icon: ICONS.error,
      description: error?.message
    })
  }
})

provide("p1Name", match.value?.p1.name)
provide("p2Name", match.value?.p2.name)
provide("p1Id", match.value?.p1.id)
provide("p2Id", match.value?.p2.id)

const tournamentName = computed(() => match.value?.name ?? name.value)
formatName.name.value = tournamentName.value

useHead({ title: `${match.value ? `${match.value.p1.name} v. ${match.value.p2.name} | ` : ""}${formatName.capitaliseName.value} ${year.value}` })

// Header links
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
        },
        color: "secondary",
        variant: "subtle"
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
        },
        color: "secondary",
        variant: "subtle"
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
        },
        color: "secondary",
        variant: "subtle"
      },
      // Tournament details link
      {
        label: match.value.name,
        icon: ICONS.trophy,
        to: {
          name: "tournament",
          params: {
            name,
            tid
          }
        },
        color: "secondary",
        variant: "subtle"
      },
      // Event pages
      ...eVENTPAGES.map(page => ({
        label: page.label,
        icon: page.icon,
        to: {
          name: page.name,
          params: {
            name,
            tid,
            year,
            eid,
            mid
          }
        },
        color: "secondary",
        variant: "subtle"
      }))
    ]
  }
  return []
})

const compoundedStats = computed(() => {
  if (match.value) {
    const serviceStats = mATCHSTATS.service.reduce((acc, stat) => {
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

    const returnStats = mATCHSTATS.return.reduce((acc, stat) => {
      const keyExists = (match.value as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      }
      return acc
    }, [] as any)

    const pointStats = mATCHSTATS.points.reduce((acc, stat) => {
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

    const serviceSpeed = mATCHSTATS.service_speed.reduce((acc, stat) => {
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
</script>

<template>
  <u-page>
    <!--@vue-expect-error-->
    <u-page-header
      headline="Matches"
      :links
      :description="`${match?.name} ${year} — ${match?.round}`"
    >
      <template #title>
        {{ match ? `${match.p1.name} v. ${match.p2.name}` : `${formatName.capitaliseName.value} ${year} ${mid}` }}
      </template>
    </u-page-header>

    <u-page-body>
      <u-container v-if="match">
        <match-details :match />

        <match-stats-panel
          v-if="compoundedStats && compoundedStats.serviceStats.length > 0"
          :stats="compoundedStats.serviceStats"
          title="Service Stats"
        />

        <match-stats-panel
          v-if="compoundedStats && compoundedStats.returnStats.length > 0"
          :stats="compoundedStats.returnStats"
          title="Return Stats"
        />

        <match-stats-panel
          v-if="compoundedStats && compoundedStats.pointStats.length > 0"
          :stats="compoundedStats.pointStats"
          title="Points Stats"
        />

        <service-speed-panel
          v-if="compoundedStats && compoundedStats.serviceSpeed.length > 0"
          :stats="compoundedStats.serviceSpeed"
        />
      </u-container>

      <error-message
        v-else
        :icon="ICONS['no-info']"
        title="No match stats available"
      />
    </u-page-body>
  </u-page>
</template>
