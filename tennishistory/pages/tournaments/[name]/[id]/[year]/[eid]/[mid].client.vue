<script setup lang="ts">
definePageMeta({ name: "match" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const checked = ref(false)
const p1 = ref<Pick<PlayerInterface, "name" | "id" | "country"> | undefined>()
const p2 = ref<Pick<PlayerInterface, "name" | "id" | "country"> | undefined>()
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual("lg")

// API call
const { data: match, status } = await useFetch<MatchDetailsType>("/api/matches/match-details", {
  query: { mid: route.params.mid, eid: route.params.eid },
  onResponse: ({ response }) => {
    const { match } = response._data
    p1.value = {
      name: match.p1.name,
      id: match.p1.id,
      country: match.p1.country
    }
    p2.value = {
      name: match.p2.name,
      id: match.p2.id,
      country: match.p2.country
    }
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching match details for ${decodeName(route.params.name as string)}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
  }
})

useHead({
  title: match.value
    ? `${p1.value?.name} v. ${p2.value?.name}`
    : `${decodeName(name.value)} ${route.params.year}`,
  templateParams: {
    subPage: match.value ? `${name.value} ${route.params.year}` : null
  }
})

const compoundedStats = computed(() => {
  if (match.value) {
    const serviceStats = MATCH_STATS.service.reduce((acc, stat) => {
      const keyExists = (match.value?.match as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      } else if (stat.label === "First serve") {
        acc.push({
          ...stat,
          value: [
            match.value?.match.serve1[1],
            match.value?.match.serve1[1]! + match.value?.match.serve2[1]!,
            match.value?.match.serve1[3],
            match.value?.match.serve1[3]! + match.value?.match.serve2[3]!
          ]
        })
      }
      return acc
    }, [] as any)

    const returnStats = MATCH_STATS.return.reduce((acc, stat) => {
      const keyExists = (match.value?.match as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      }
      return acc
    }, [] as any)

    const pointStats = MATCH_STATS.points.reduce((acc, stat) => {
      const keyExists = (match.value?.match as any)[stat.key as keyof typeof match.value]
      if (keyExists) {
        acc.push({
          ...stat,
          value: keyExists
        })
      } else if (stat.label === "Service points won") {
        acc.push({
          ...stat,
          value: [
            match.value?.match.serve1[0]! + match.value?.match.serve2[0]!,
            match.value?.match.serve1[1]! + match.value?.match.serve2[1]!,
            match.value?.match.serve1[2]! + match.value?.match.serve2[2]!,
            match.value?.match.serve1[3]! + match.value?.match.serve2[3]!
          ]
        })
      } else if (stat.label === "Return points won") {
        acc.push({
          ...stat,
          value: [
            match.value?.match.ret1[0]! + match.value?.match.ret2[0]!,
            match.value?.match.ret1[1]! + match.value?.match.ret2[1]!,
            match.value?.match.ret1[2]! + match.value?.match.ret2[2]!,
            match.value?.match.ret1[3]! + match.value?.match.ret2[3]!
          ]
        })
      } else if (stat.label === "Total points won") {
        acc.push({
          ...stat,
          value: [
            match.value?.match.serve1[0]! +
              match.value?.match.serve2[0]! +
              match.value?.match.ret1[0]! +
              match.value?.match.ret2[0]!,
            match.value?.match.serve1[1]! +
              match.value?.match.serve2[1]! +
              match.value?.match.ret1[1]! +
              match.value?.match.ret2[1]!,
            match.value?.match.serve1[2]! +
              match.value?.match.serve2[2]! +
              match.value?.match.ret1[2]! +
              match.value?.match.ret2[2]!,
            match.value?.match.serve1[3]! +
              match.value?.match.serve2[3]! +
              match.value?.match.ret1[3]! +
              match.value?.match.ret2[3]!
          ]
        })
      }
      return acc
    }, [] as any)

    const serviceSpeed = MATCH_STATS.service_speed.reduce((acc, stat) => {
      const keyExists = (match.value?.match as any)[stat.key as keyof typeof match.value]
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
  {
    label: name.value,
    to: { name: "tournament", params: { name: name.value, id: route.params.id } }
  },
  {
    label: route.params.year as string,
    to: {
      name: "event",
      params: {
        name: name.value,
        id: route.params.id,
        year: route.params.year,
        eid: route.params.eid
      }
    }
  },
  { label: match.value ? match.value.match.round : "Loading..." },
  {
    label: match.value ? `${p1.value?.name} v. ${p2.value?.name}` : (route.params.mid as string)
  }
])

// Related links
const links = computed(() => {
  if (match.value) {
    return [
      // Player links
      {
        label: p1.value?.name,
        avatar: {
          src: `https://www.atptour.com/-/media/alias/player-headshot/${p1.value?.id}`,
          icon: ICONS.player,
          class: "border border-neutral-600 dark:border-neutral-400"
        },
        to: {
          name: "player",
          params: {
            name: encodeName(p1.value?.name ?? ""),
            id: p1.value?.id
          }
        }
      },
      {
        label: p2.value?.name,
        avatar: {
          src: `https://www.atptour.com/-/media/alias/player-headshot/${p2.value?.id}`,
          icon: ICONS.player,
          class: "border border-neutral-600 dark:border-neutral-400"
        },
        to: {
          name: "player",
          params: {
            name: encodeName(p2.value?.name ?? ""),
            id: p2.value?.id
          }
        }
      },
      // Head to head link
      {
        label: "H2H",
        icon: ICONS.h2h,
        to: {
          name: "h2h-players",
          params: {
            p1Name: encodeName(p1.value?.name ?? ""),
            p2Name: encodeName(p2.value?.name ?? ""),
            p1Id: p1.value?.id,
            p2Id: p2.value?.id
          }
        }
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
        <ClientOnly>
          <u-breadcrumb :items />
        </ClientOnly>
      </template>
      <template #right>
        <ClientOnly>
          <u-button
            v-if="lgAndUp"
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            :label="link.label"
            :icon="link.icon"
            :avatar="link.avatar"
            size="sm"
          />
          <u-dropdown-menu
            v-else
            :items="links"
          >
            <u-button
              :icon="ICONS.layers"
              color="neutral"
              variant="link"
              size="xl"
            />
          </u-dropdown-menu>
        </ClientOnly>
      </template>
      <template #toolbar>
        <u-switch
          v-model="checked"
          :checked-icon="ICONS.barChart"
          :unchecked-icon="ICONS.table"
          :label="checked ? 'Chart' : 'Table'"
          class="ml-auto"
        />
      </template>

      <match-details
        v-if="match"
        :match="match.match"
        :dates="match.dates"
        :surface="match.surface"
      />

      <match-details-loading v-else-if="['pending', 'idle'].includes(status)" />

      <div
        v-if="compoundedStats && p1 && p2"
        :class="checked ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-2 gap-5'"
      >
        <match-stats-panel
          v-if="compoundedStats.serviceStats.length"
          :stats="compoundedStats.serviceStats"
          title="Service Stats"
          :checked
          :p1
          :p2
        />

        <match-stats-panel
          v-if="compoundedStats.returnStats.length"
          :stats="compoundedStats.returnStats"
          title="Return Stats"
          :checked
          :p1
          :p2
        />

        <match-stats-panel
          v-if="compoundedStats.pointStats.length"
          :stats="compoundedStats.pointStats"
          title="Points Stats"
          :checked
          :p1
          :p2
        />

        <service-speed-panel
          v-if="compoundedStats.serviceSpeed.length"
          :stats="compoundedStats.serviceSpeed"
          :checked
          :p1
          :p2
        />
      </div>
      <error-message
        v-else
        :icon="ICONS.noChart"
        :title="`No match stats available for ${name} ${route.params.year} ${route.params.mid}`"
      />
    </nuxt-layout>
  </div>
</template>
