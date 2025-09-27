<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui"

definePageMeta({ name: "match" })
const {
  ui: { icons }
} = useAppConfig()
const {
  params: { name, year, eid, mid }
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
      icon: ICONS.player,
      to: { name: "player", params: { id: p.id, name: kebabCase(`${p.first_name} ${p.last_name}`) } },
      color: ["ATP", "Men"].includes(tour) ? "atp" : "wta"
    }))
    const p2Links = p2.map(p => ({
      label: `${p.first_name} ${p.last_name}`,
      icon: ICONS.player,
      to: { name: "player", params: { id: p.id, name: kebabCase(`${p.first_name} ${p.last_name}`) } },
      color: ["ATP", "Men"].includes(tour) ? "atp" : "wta"
    }))
    const h2hLink = [
      {
        label: "H2H",
        icon: ICONS.h2h,
        to: {
          name: "head-to-head",
          params: {
            p1Name: p1.map(player => kebabCase(`${player.first_name} ${player.last_name}`)).join("+"),
            p2Name: p2.map(player => kebabCase(`${player.first_name} ${player.last_name}`)).join("+"),
            p1Id: p1.map(player => player.id).join("+"),
            p2Id: p2.map(player => player.id).join("+")
          }
        }
      }
    ]
    const chartLink = chart_link
      ? [
          {
            label: "TA Chart",
            icon: ICONS.lineChart,
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
          :icon="icons.info"
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
          :name="ICONS.colours"
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
