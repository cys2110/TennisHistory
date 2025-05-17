<script setup lang="ts">
import { MatchStatsGrid, MatchStatsTable } from "#components"

definePageMeta({ name: "match" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const lgAndUp = breakpoints.greaterOrEqual("lg")
const name = computed(() => decodeName(route.params.name as string))

interface MatchStatsType {
  label: string
  p1: string
  p1_pc: number
  p2: string
  p2_pc: number
  category: string
}

// API call
const { data: match, status } = await useFetch<MatchDetailsType>("/api/match-details", {
  query: { mid: route.params.mid, id: route.params.eid },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching match details for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
  }
})

const p1 = computed(() => {
  if (match.value) {
    return {
      name: match.value.match.p1.name,
      id: match.value.match.p1.id,
      country: match.value.match.p1.country
    }
  }
  return null
})
const p2 = computed(() => {
  if (match.value) {
    return {
      name: match.value.match.p2.name,
      id: match.value.match.p2.id,
      country: match.value.match.p2.country
    }
  }
  return null
})

useHead({
  title: match.value ? `${p1.value?.name} v. ${p2.value?.name}` : `${decodeName(name.value)} ${route.params.year}`,
  templateParams: {
    subPage: match.value ? `${name.value} ${route.params.year}` : null
  }
})

const compoundedStats = computed(() => {
  if (match.value) {
    return MATCH_STATS.map(stat => {
      const keyExists = (match.value?.match as any)[stat.key as keyof typeof match.value]
      const serve1 = match.value?.match.serve1!
      const serve2 = match.value?.match.serve2!
      const ret1 = match.value?.match.ret1!
      const ret2 = match.value?.match.ret2!
      if (keyExists) {
        return {
          category: stat.category,
          label: stat.label,
          p1: keyExists.length === 2 ? keyExists[0] : `${keyExists[0]}/${keyExists[1]}`,
          p1_pc:
            keyExists.length === 2
              ? keyExists[0] + keyExists[1] === 0
                ? 0
                : percentage(keyExists[0], keyExists[0] + keyExists[1])
              : keyExists[1] === 0
              ? 0
              : percentage(keyExists[0], keyExists[1]),
          p2: keyExists.length === 2 ? keyExists[1] : `${keyExists[2]}/${keyExists[3]}`,
          p2_pc:
            keyExists.length === 2
              ? keyExists[0] + keyExists[1] === 0
                ? 0
                : percentage(keyExists[1], keyExists[0] + keyExists[1])
              : keyExists[3] === 0
              ? 0
              : percentage(keyExists[2], keyExists[3])
        }
      } else if (stat.label === "First serve") {
        return {
          category: stat.category,
          label: stat.label,
          p1: `${serve1[1]}/${serve1[1] + serve2[1]}`,
          p1_pc: percentage(serve1[1], serve1[1] + serve2[1]),
          p2: `${serve1[3]}/${serve1[3] + serve2[3]}`,
          p2_pc: percentage(serve1[3], serve1[3] + serve2[3])
        }
      } else if (stat.label === "Service points won") {
        return {
          category: stat.category,
          label: stat.label,
          p1: `${serve1[0] + serve2[0]}/${serve1[1] + serve2[1]}`,
          p1_pc: percentage(serve1[0] + serve2[0], serve1[1] + serve2[1]),
          p2: `${serve1[2] + serve2[2]}/${serve1[3] + serve2[3]}`,
          p2_pc: percentage(serve1[2] + serve2[2], serve1[3] + serve2[3])
        }
      } else if (stat.label === "Return points won") {
        return {
          category: stat.category,
          label: stat.label,
          p1: `${ret1[0] + ret2[0]}/${ret1[1] + ret2[1]}`,
          p1_pc: percentage(ret1[0] + ret2[0], ret1[1] + ret2[1]),
          p2: `${ret1[2] + ret2[2]}/${ret1[3] + ret2[3]}`,
          p2_pc: percentage(ret1[2] + ret2[2], ret1[3] + ret2[3])
        }
      } else if (stat.label === "Total points won") {
        return {
          category: stat.category,
          label: stat.label,
          p1: `${serve1[0] + serve2[0] + ret1[0] + ret2[0]}/${serve1[1] + serve2[1] + ret1[1] + ret2[1]}`,
          p1_pc: percentage(serve1[0] + serve2[0] + ret1[0] + ret2[0], serve1[1] + serve2[1] + ret1[1] + ret2[1]),
          p2: `${serve1[2] + serve2[2] + ret1[2] + ret2[2]}/${serve1[3] + serve2[3] + ret1[3] + ret2[3]}`,
          p2_pc: percentage(serve1[2] + serve2[2] + ret1[2] + ret2[2], serve1[3] + serve2[3] + ret1[3] + ret2[3])
        }
      }
    }).filter(stat => stat !== undefined) as MatchStatsType[]
  }
  return []
})

// Breadcrumbs
const breadcrumbs = computed(() => [
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
    slot: "players" as const,
    label: p1.value && p2.value ? `${p1.value?.name} v. ${p2.value?.name}` : (route.params.mid as string)
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
          icon: ICONS.player
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
          icon: ICONS.player
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
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <ClientOnly>
              <u-breadcrumb :items="breadcrumbs">
                <template #players-leading>
                  <u-avatar
                    :src="`https://www.atptour.com/-/media/alias/player-headshot/${p1?.id}`"
                    :icon="ICONS.player"
                    size="sm"
                  />
                </template>
                <template #players-trailing>
                  <u-avatar
                    :src="`https://www.atptour.com/-/media/alias/player-headshot/${p2?.id}`"
                    :icon="ICONS.player"
                    size="sm"
                  />
                </template>
              </u-breadcrumb>
            </ClientOnly>
          </template>

          <template #right>
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
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <match-details
          v-if="match"
          :match="match.match"
          :dates="match.dates"
          :surface="match.surface"
        />
        <match-details-loading v-else-if="['pending', 'idle'].includes(status)" />

        <component
          :is="viewMode === 'cards' ? MatchStatsGrid : MatchStatsTable"
          :key="viewMode"
          :stats="compoundedStats"
          :p1
          :p2
          :status
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
