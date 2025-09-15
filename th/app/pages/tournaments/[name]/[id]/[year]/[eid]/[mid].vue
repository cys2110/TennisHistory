<script setup lang="ts">
import { type DropdownMenuItem } from "@nuxt/ui"

definePageMeta({ name: "match" })
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const {
  params: { name, id, year, eid, mid }
} = useRoute("match")
const { draw, tour, type } = destructureMid(mid)

const categories: Record<string, string> = {
  "Service Stats": "text-men",
  "Return Stats": "text-women",
  "Points Stats": "text-primary",
  "Service Speed": "text-main"
}

// API call
const { data: match, status } = await useFetch<MatchInterface & { tournament: string }>("/api/matches", {
  key: `match-${mid}-${eid}`,
  query: { mid, id: eid },
  server: false
})

useHead({
  title: () => {
    if (match.value) {
      const { p1, p2, tournament } = match.value
      const p1Name = p1.map(p => `${p.first_name} ${p.last_name}`).join(" / ")
      const p2Name = p2.map(p => `${p.first_name} ${p.last_name}`).join(" / ")

      return `${p1Name} v ${p2Name} | ${tournament} ${year}`
    }
    return `${capitalCase(name as string)} ${year}`
  }
})

const additionalLinks = computed<DropdownMenuItem[]>(() => {
  if (match.value) {
    const { chart_link, p1, p2 } = match.value
    const p1Links = p1.map(p => ({
      label: `${p.first_name} ${p.last_name}`,
      icon: icons.player,
      to: { name: "player", params: { id: p.id, name: kebabCase(`${p.first_name} ${p.last_name}`) } },
      color: ["ATP", "Men"].includes(tour) ? "atp" : "wta"
    }))
    const p2Links = p2.map(p => ({
      label: `${p.first_name} ${p.last_name}`,
      icon: icons.player,
      to: { name: "player", params: { id: p.id, name: kebabCase(`${p.first_name} ${p.last_name}`) } },
      color: ["ATP", "Men"].includes(tour) ? "atp" : "wta"
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
    return [...p1Links, ...p2Links, ...h2hLink, ...chartLink] as DropdownMenuItem[]
  }

  return []
})
</script>

<template>
  <event-wrapper>
    <template #navbar-right>
      <u-dropdown-menu :items="additionalLinks">
        <u-button
          :icon="uIcons.info"
          variant="ghost"
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
      :status
    />

    <match-table
      v-if="match"
      :match
      :status
    />
  </event-wrapper>
</template>
