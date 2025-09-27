<script setup lang="ts">
import { CountryLink, PlayerLink } from "#components"
import type { TableColumn } from "@nuxt/ui"

definePageMeta({ name: "player" })
const {
  params: { id }
} = useRoute("player")

const playerYears = useState<string[]>("player-years")
const playerTour = useState<TourType>("player-tour")
const playerName = useState<string>("player-name")

// Determine whether player is still active on tour
const activeYears = computed(() => {
  let active = false
  let numberOfYears = 0
  let activeYears = ""
  if (playerYears.value.length > 0) {
    const lastYear = playerYears.value[playerYears.value.length - 1]
    active = Number(lastYear) === new Date().getFullYear()
    numberOfYears = Number(lastYear) - Number(playerYears.value[0]) + 1
    activeYears = `${playerYears.value[0]}${
      playerYears.value.length > 1 ? ` — ${active ? "present" : playerYears.value[playerYears.value.length - 1]}` : ""
    }`
  }
  return { active, numberOfYears, activeYears }
})

// API call
const { data, status } = await useFetch<PlayerInterface>("/api/players/details", {
  key: `player-${id}`,
  query: { id },
  server: false
})

const details = computed(() => {
  if (data.value) {
    const player = data.value
    return [
      { label: "Career Prize Money", value: (player.pm ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" }) },
      { label: "Age", value: player.age },
      { label: "Height", value: player.height },
      { label: "Plays", value: isDefined(player.rh) ? handedness(player.rh) : "Unknown" },
      { label: "Backhand", value: player.bh ? `${player.bh}-Handed` : "Unknown" },
      {
        label: player.turned_pro && player.retired ? "Career span" : player.turned_pro ? "Turned Pro" : player.retired ? "Retired" : "Career span",
        value: player.turned_pro
      },
      { label: player.coaches?.length === 1 ? "Coach" : "Coaches", value: player.coaches },
      { label: "Hall of Fame Induction", value: player.hof },
      { label: player.countries?.length === 1 ? "Previous Representation" : "Previous Representations", value: player.countries }
    ]
  }
  return []
})

const stats = computed(() => {
  if (data.value) {
    const player = data.value

    return [
      { category: "Ranking", rowspan: 3, label: "Current rank", singles: player.current_singles, doubles: player.current_doubles },
      { label: "Career High", singles: player.ch_singles, doubles: player.ch_doubles },
      {
        label: "Career High Date",
        singles: player.singles_ch_date ? dateTimeFormat.format(getDate(player.singles_ch_date)) : undefined,
        doubles: player.doubles_ch_date ? dateTimeFormat.format(getDate(player.doubles_ch_date)) : undefined
      },
      { category: "Titles", rowspan: 4, label: "Total", singles: player.titles[3]?.singles, doubles: player.titles[3]?.doubles },
      { label: "Tour", singles: player.titles[0]?.singles, doubles: player.titles[0]?.doubles },
      { label: "Challenger", singles: player.titles[1]?.singles, doubles: player.titles[1]?.doubles },
      { label: "ITF", singles: player.titles[2]?.singles, doubles: player.titles[2]?.doubles },
      { category: "Win-Loss", rowspan: 1, colspan: 4 },
      {
        category: "Main draws",
        rowspan: 4,
        label: "Total",
        singles: `${player.wl[3]?.singles.wins}-${player.wl[3]?.singles.losses}`,
        doubles: `${player.wl[3]?.doubles.wins}-${player.wl[3]?.doubles.losses}`
      },
      {
        label: "Tour",
        singles: `${player.wl[0]?.singles.wins}-${player.wl[0]?.singles.losses}`,
        doubles: `${player.wl[0]?.doubles.wins}-${player.wl[0]?.doubles.losses}`
      },
      {
        label: "Challenger",
        singles: `${player.wl[1]?.singles.wins}-${player.wl[1]?.singles.losses}`,
        doubles: `${player.wl[1]?.doubles.wins}-${player.wl[1]?.doubles.losses}`
      },
      {
        label: "ITF",
        singles: `${player.wl[2]?.singles.wins}-${player.wl[2]?.singles.losses}`,
        doubles: `${player.wl[2]?.doubles.wins}-${player.wl[2]?.doubles.losses}`
      },
      {
        category: "Qualifying draws",
        rowspan: 4,
        label: "Total",
        singles: `${player.wl[3]?.singles.q_wins}-${player.wl[3]?.singles.q_losses}`,
        doubles: `${player.wl[3]?.doubles.q_wins}-${player.wl[3]?.doubles.q_losses}`
      },
      {
        label: "Tour",
        singles: `${player.wl[0]?.singles.q_wins}-${player.wl[0]?.singles.q_losses}`,
        doubles: `${player.wl[0]?.doubles.q_wins}-${player.wl[0]?.doubles.q_losses}`
      },
      {
        label: "Challenger",
        singles: `${player.wl[1]?.singles.q_wins}-${player.wl[1]?.singles.q_losses}`,
        doubles: `${player.wl[1]?.doubles.q_wins}-${player.wl[1]?.doubles.q_losses}`
      },
      {
        label: "ITF",
        singles: `${player.wl[2]?.singles.q_wins}-${player.wl[2]?.singles.q_losses}`,
        doubles: `${player.wl[2]?.doubles.q_wins}-${player.wl[2]?.doubles.q_losses}`
      }
    ]
  }
  return []
})

const detailsColumns: TableColumn<(typeof details.value)[number]>[] = [
  { accessorKey: "label", header: "", meta: { class: { td: "font-medium text-right" } } },
  {
    accessorKey: "value",
    header: "",
    cell: ({ row }) => {
      const label = row.original.label
      const value = row.original.value
      switch (label) {
        case "Age":
          return h("div", {}, [
            h("div", {}, value ? `${value} years` : "Unknown"),
            data.value?.dob || data.value?.dod
              ? h(
                  "div",
                  {},
                  data.value?.dob && data.value?.dod
                    ? dateTimeFormat.formatRange(getDate(data.value.dob), getDate(data.value.dod))
                    : data.value?.dob
                    ? dateTimeFormat.format(getDate(data.value.dob))
                    : undefined
                )
              : null
          ])
        case "Height":
          return h("div", {}, [h("div", {}, value ? `${value} cm` : "Unknown"), value ? h("div", {}, `${convertToFt(value as number)}`) : null])
        case "Coach":
        case "Coaches":
          if (Array.isArray(value)) {
            return value?.map((coach: any) => h("div", {}, `${coach.first_name} ${coach.last_name}`))
          }
        case "Previous Representation":
        case "Previous Representations":
          if (Array.isArray(value)) {
            if (value.length === 0) return "—"
            return value?.map((country: any) =>
              h(
                "div",
                {
                  class: "flex items-center gap-1"
                },
                [
                  h(CountryLink, { country }),
                  country.start_date && country.end_date
                    ? `(${dateTimeFormat.formatRange(getDate(country.start_date), getDate(country.end_date))})`
                    : undefined
                ]
              )
            )
          }
        default:
          return value ?? "—"
      }
    }
  }
]

const statsColumns: TableColumn<(typeof stats.value)[number]>[] = [
  {
    accessorKey: "category",
    header: "",
    meta: {
      rowspan: {
        // @ts-ignore
        td: ({ row }) => {
          if (row.original.rowspan) {
            return String(row.original.rowspan)
          }
        }
      },
      colspan: {
        td: ({ row }) => String(row.original.colspan ? row.original.colspan : 1)
      },
      class: { td: ({ row }) => (row.original.colspan ? "font-semibold" : row.original.rowspan ? "" : "hidden") }
    }
  },
  { accessorKey: "label", header: "" },
  { accessorKey: "singles", header: "Singles" },
  { accessorKey: "doubles", header: "Doubles" }
]

const h2hColumns: TableColumn<PlayerInterface["h2h"][number]>[] = [
  {
    id: "opponent",
    header: "Opponent",
    cell: ({ row }) => h(PlayerLink, { player: row.original.opponent })
  },
  {
    id: "wl",
    header: "Win-Loss",
    cell: ({ row }) => `${row.original.wins} - ${row.original.matches - row.original.wins}`
  }
]
</script>

<template>
  <player-wrapper v-slot="{ country }">
    <u-page-header
      :title="playerName"
      :description="`Years Active: ${activeYears.activeYears} (${activeYears.numberOfYears} ${activeYears.numberOfYears === 1 ? 'year' : 'years'})`"
    >
      <template #headline>
        <country-link
          :country
          icon-only
        />
        <u-badge
          :color="activeYears.active ? 'active' : 'inactive'"
          :label="activeYears.active ? 'Active' : 'Inactive'"
        />
        <u-badge
          :color="getTourColour([playerTour])"
          :label="playerTour"
        />
      </template>
    </u-page-header>

    <div class="flex flex-wrap justify-evenly gap-4">
      <u-table
        :data="details || []"
        :columns="detailsColumns"
        :loading="['idle', 'pending'].includes(status)"
        class="my-5"
      >
        <template #loading>
          <table-loading-icon />
        </template>

        <template #empty>
          <table-empty-message :message="`No bio found for ${playerName}`" />
        </template>
      </u-table>

      <u-table
        :data="stats || []"
        :columns="statsColumns"
        :loading="['idle', 'pending'].includes(status)"
      >
        <template #loading>
          <table-loading-icon />
        </template>

        <template #empty>
          <table-empty-message
            :icon="ICONS.noChart"
            :message="`No stat details found for ${playerName}`"
          />
        </template>
      </u-table>

      <u-table
        :data="data?.h2h || []"
        :columns="h2hColumns"
        :loading="['idle', 'pending'].includes(status)"
      >
        <template #loading>
          <table-loading-icon />
        </template>

        <template #empty>
          <table-empty-message
            :icon="ICONS.noH2H"
            :message="`No head-to-head records found for ${playerName}`"
          />
        </template>
      </u-table>
    </div>
  </player-wrapper>
</template>
