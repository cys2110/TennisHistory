<script setup lang="ts">
import { MatchGrid, MatchTable } from "#components"
definePageMeta({ name: "match" })
const { viewMode } = useViewMode()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const lgAndDown = breakpoints.smallerOrEqual("lg")
const { params } = useRoute()
const { mid, eid, name, year } = params as {
  mid?: string
  eid?: string
  name?: string
  year?: string
}

// Variables
const categories: Record<string, string> = {
  "Service Stats": "text-men",
  "Return Stats": "text-women",
  "Points Stats": "text-joint",
  "Service Speed": "text-active"
}

// API call
const { data: match, status } = await useFetch<MatchDetailsType>("/api/matches", {
  query: { mid, id: eid }
})

// Head
const headValues = computed(() => {
  if (match.value) {
    const {
      match: { p1, p2 }
    } = match.value
    const p1Name = p1.map(p => `${p.first_name} ${p.last_name}`).join(" / ")
    const p2Name = p2.map(p => `${p.first_name} ${p.last_name}`).join(" / ")
    return {
      title: `${p1Name} v ${p2Name}`,
      subPage: `${capitalCase(name as string)} ${year}`
    }
  }
  return {
    title: `${capitalCase(name as string)} ${year}`,
    subPage: null
  }
})

useHead({
  title: `${headValues.value.title} | ${headValues.value.subPage}`
})

provide("tournament", match.value?.tournament ?? null)

const compoundedStats = computed(() => {
  if (match.value) {
    return MATCH_STATS.map(stat => {
      const keyExists = match.value?.match[stat.key]
      if (keyExists && Array.isArray(keyExists)) {
        if (keyExists.length === 2) {
          const [p1Stat, p2Stat] = keyExists as number[]
          return {
            category: stat.category,
            label: stat.label,
            p1: p1Stat,
            p1_pc: p1Stat! + p2Stat! === 0 ? 0 : percentage(p1Stat!, p1Stat! + p2Stat!),
            p2: p2Stat,
            p2_pc: p1Stat! + p2Stat! === 0 ? 0 : percentage(p2Stat!, p1Stat! + p2Stat!)
          }
        } else {
          const [p1Net, p1Total, p2Net, p2Total] = keyExists
          return {
            category: stat.category,
            label: stat.label,
            p1: `${p1Net}/${p1Total}`,
            p1_pc: p1Total === 0 ? 0 : percentage(p1Net! as number, p1Total! as number),
            p2: `${p2Net}/${p2Total}`,
            p2_pc: p2Total === 0 ? 0 : percentage(p2Net! as number, p2Total! as number)
          }
        }
      }
    }).filter(Boolean) as MatchStatsType[]
  }
  return []
})

// Related links
const links = computed(() => {
  if (match.value) {
    const { chart_link, p1, p2 } = match.value.match
    const p1Links = p1.map(p => ({
      label: `${p.first_name} ${p.last_name}`,
      icon: icons.player,
      to: { name: "player", params: { id: p.id, name: kebabCase(`${p.first_name} ${p.last_name}`) } }
    }))
    const p2Links = p2.map(p => ({
      label: `${p.first_name} ${p.last_name}`,
      icon: icons.player,
      to: { name: "player", params: { id: p.id, name: kebabCase(`${p.first_name} ${p.last_name}`) } }
    }))
    const h2hLink =
      p1.length === 1 ?
        [
          {
            label: "H2H",
            icon: icons.h2h,
            to: {
              name: "h2h-players",
              params: {
                p1Name: kebabCase(`${p1[0]?.first_name} ${p1[0]?.last_name}`),
                p2Name: kebabCase(`${p2[0]?.first_name} ${p2[0]?.last_name}`),
                p1Id: p1[0]?.id,
                p2Id: p2[0]?.id
              }
            }
          }
        ]
      : []
    const chartLink =
      chart_link ?
        [
          {
            label: "TA Chart",
            icon: icons.lineChart,
            to: chart_link,
            target: "_blank"
          }
        ]
      : []
    return [...p1Links, ...p2Links, ...h2hLink, ...chartLink]
  }
  return []
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <!--@vue-expect-error-->
      <u-dropdown-menu :items="links">
        <u-button
          :icon="appIcons.ellipsis"
          variant="ghost"
          size="xl"
          :ui="{ leadingIcon: 'rotate-90' }"
        />
      </u-dropdown-menu>
    </template>

    <template #toolbar>
      <div
        v-for="(className, category) in categories"
        :key="category"
        class="flex items-center gap-2"
      >
        <u-icon
          :name="icons.colours"
          :class="className"
        />
        <span>{{ category }}</span>
      </div>
    </template>

    <match-details
      v-if="match"
      :match
    />

    <component
      :is="viewMode === 'cards' ? MatchGrid : MatchTable"
      :stats="compoundedStats"
      :status
      :p1="match?.match.p1"
      :p2="match?.match.p2"
    />
  </page-wrapper>
</template>
