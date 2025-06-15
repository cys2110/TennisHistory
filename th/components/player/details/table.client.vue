<script setup lang="ts">
// @ts-nocheck
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
const { active, tour, status, player } = defineProps<{
  active: boolean
  tour: TourType
  status: APIStatusType
  player: PlayerDetailsType
}>()
const {
  ui: { icons }
} = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
const currentYear = new Date().getFullYear()

const statsDetails = computed(() => [
  {
    title: "Current Ranking",
    singles: player.current_singles ?? "—",
    doubles: player.current_doubles ?? "—"
  },
  {
    title: "Career High",
    singles: player.ch_singles ?? "—",
    singles_description: player.singles_ch_date ?? undefined,
    doubles: player.ch_doubles ?? "—",
    doubles_description: player.doubles_ch_date ?? undefined
  }
])

const playerDetails = computed(() => [
  {
    title: "Career Prize Money",
    value: `$${player.pm}`
  },
  {
    title: "Age",
    value: player.age ? `${player.age} years` : "Unknown",
    description: player.dod ? `${player.dob} - ${player.dod}` : (player.dob ?? undefined)
  },
  {
    title: "Height",
    value: player.height ? `${player.height} cm` : "Unknown",
    description: player.height ? convertToFt(player.height) : undefined
  },
  {
    title: "Plays",
    value: player.rh === null ? "Unknown" : handedness(player.rh)
  },
  {
    title: "Backhand",
    value: player.bh ? `${player.bh}-Handed` : "Unknown"
  },
  {
    title:
      player.turned_pro && !player.retired ? "Turned pro"
      : player.retired && !player.turned_pro ? "Retired"
      : "Career span",
    value:
      !player.turned_pro && !player.retired ? "Unknown"
      : player.turned_pro ? `${player.turned_pro} - ${player.retired || "present"}`
      : `—${player.retired}`,
    description:
      player.turned_pro && player.retired ? `${player.retired - player.turned_pro} years`
      : player.turned_pro && active ? `${currentYear - player.turned_pro} years`
      : undefined
  },
  {
    title: "Hall of Fame Induction",
    value: player.hof ?? "—"
  },
  {
    title: player.coaches.length === 1 ? "Coach" : "Coaches",
    value: player.coaches.map(c => ({ ...c }))
  },
  {
    title: "Previous Representations",
    value: player.countries.map(r => ({ ...r }))
  }
])

const levelColours = {
  Tour: "joint",
  Challenger: "warning",
  ITF: "info",
  Total: "primary"
}

const winLossData = computed(() => {
  const levels = ["Tour", "Challenger", "ITF"]
  const singles_wl = levels.map(level => ({
    level,
    type: "Singles",
    wins: player[`${level.toLowerCase()}_singles_wins` as keyof typeof player] || 0,
    losses: player[`${level.toLowerCase()}_singles_loss` as keyof typeof player] || 0,
    q_wins: player[`${level.toLowerCase()}_q_singles_wins` as keyof typeof player] || 0,
    q_losses: player[`${level.toLowerCase()}_q_singles_loss` as keyof typeof player] || 0,
    titles: player[`${level.toLowerCase()}_singles_titles` as keyof typeof player] || 0
  }))
  const doubles_wl = levels.map(level => ({
    level,
    type: "Doubles",
    wins: player[`${level.toLowerCase()}_doubles_wins` as keyof typeof player] || 0,
    losses: player[`${level.toLowerCase()}_doubles_loss` as keyof typeof player] || 0,
    q_wins: player[`${level.toLowerCase()}_q_doubles_wins` as keyof typeof player] || 0,
    q_losses: player[`${level.toLowerCase()}_q_doubles_loss` as keyof typeof player] || 0,
    titles: player[`${level.toLowerCase()}_doubles_titles` as keyof typeof player] || 0
  }))

  type WinLossType = (typeof singles_wl)[number] & (typeof doubles_wl)[number]
  return [
    ...singles_wl,
    ...doubles_wl,
    {
      level: "Total",
      type: "Singles",
      titles: singles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.titles), 0),
      wins: singles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.wins), 0),
      losses: singles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.losses), 0),
      q_wins: singles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.q_wins), 0),
      q_losses: singles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.q_losses), 0)
    },
    {
      level: "Total",
      type: "Doubles",
      titles: doubles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.titles), 0),
      wins: doubles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.wins), 0),
      losses: doubles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.losses), 0),
      q_wins: doubles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.q_wins), 0),
      q_losses: doubles_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.q_losses), 0)
    }
  ]
})

type PlayerDataType = (typeof playerDetails.value)[number]
type statsArrayType = (typeof statsDetails.value)[number]
type WinLossDataType = (typeof winLossData.value)[number]

const detailsColumns: TableColumn<PlayerDataType>[] = [
  { accessorKey: "title", header: "Background" },
  { id: "value", meta: { class: { td: "font-semibold" } }, header: "" }
]

const statsColumns: TableColumn<statsArrayType>[] = [
  { accessorKey: "title", header: "" },
  { accessorKey: "singles", header: "Singles", meta: { class: { td: "font-semibold" } } },
  { accessorKey: "doubles", header: "Doubles", meta: { class: { td: "font-semibold" } } }
]

const wlColumns: TableColumn<WinLossDataType>[] = [
  { id: "expand", header: "Level" },
  { accessorKey: "level" },
  { accessorKey: "type" },
  {
    accessorKey: "titles",
    header: "Titles",
    aggregationFn: "sum",
    meta: { class: { td: "font-semibold" } }
  },
  {
    accessorKey: "wins",
    header: "Wins",
    aggregationFn: "sum",
    meta: { class: { td: "font-semibold" } }
  },
  {
    accessorKey: "losses",
    header: "Losses",
    aggregationFn: "sum",
    meta: { class: { td: "font-semibold" } }
  },
  {
    accessorKey: "q_wins",
    header: "Qualifying Wins",
    aggregationFn: "sum",
    meta: { class: { td: "font-semibold" } }
  },
  {
    accessorKey: "q_losses",
    header: "Qualifying Losses",
    aggregationFn: "sum",
    meta: { class: { td: "font-semibold" } }
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <div class="columns-1 md:columns-2 h-full gap-5">
    <u-table
      :data="playerDetails"
      :columns="detailsColumns"
      class="max-h-200"
      :loading="['pending', 'idle'].includes(status)"
      sticky
      :empty="`No details found for ${name}`"
    >
      <template #value-cell="{ row }">
        <div
          v-if="row.original.title && ['Coach', 'Coaches'].includes(row.original.title)"
          class="flex flex-col gap-1 w-fit mx-auto"
        >
          <u-link
            v-for="coach in row.original.value"
            :key="coach.id"
            :to="{
              name: 'coach',
              params: { id: encodeName(coach.id) }
            }"
            class="hover-link"
          >
            {{ coach.name ?? coach.id }}
          </u-link>
        </div>
        <div
          v-else-if="row.original.title === 'Previous Representations'"
          class="flex flex-col gap-2 w-fit mx-auto"
        >
          <div
            v-for="country in row.original.value"
            :key="country.id"
            class="flex flex-col gap-1 w-fit"
          >
            <u-link
              :to="{
                name: 'country',
                params: { id: country.id, name: encodeName(country.name) }
              }"
              class="flex items-center gap-2"
            >
              <u-icon :name="getFlagCode(country)" />
              <span class="hover-link text-sm">{{ country.name }}</span>
            </u-link>
            <div>{{ country.dates }}</div>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col gap-1 w-fit mx-auto"
        >
          <span>{{ row.original.value }}</span>
          <span
            v-if="row.original.description"
            class="font-medium text-xs"
          >
            {{ row.original.description }}
          </span>
        </div>
      </template>
    </u-table>
    <u-table
      :data="statsDetails"
      :columns="statsColumns"
      class="max-h-200"
      :loading="['pending', 'idle'].includes(status)"
      sticky
      :empty="`No stats found for ${name}`"
    >
      <template #singles-cell="{ row }">
        <div class="flex flex-col gap-1 w-fit mx-auto">
          <span>{{ row.original.singles }}</span>
          <span
            v-if="row.original.singles_description"
            class="font-medium text-xs"
          >
            {{ row.original.singles_description }}
          </span>
        </div>
      </template>

      <template #doubles-cell="{ row }">
        <div class="flex flex-col gap-1 w-fit mx-auto">
          <span>{{ row.original.doubles }}</span>
          <span
            v-if="row.original.doubles_description"
            class="font-medium text-xs"
          >
            {{ row.original.doubles_description }}
          </span>
        </div>
      </template>
    </u-table>
    <u-table
      :data="winLossData"
      :columns="wlColumns"
      :loading="['pending', 'idle'].includes(status)"
      sticky
      :grouping="['level', 'type']"
      :grouping-options="grouping_options"
      :ui="{
        root: 'mt-5 max-h-200 max-w-full min-w-full md:min-w-3/4 xl:min-w-1/2 mx-auto',
        td: 'empty:p-0' // helps with the colspaned row added for expand slot
      }"
      :empty="`No win-loss data available for ${name}`"
    >
      <template #expand-cell="{ row }">
        <div
          v-if="row.getIsGrouped() && row.depth === 0"
          class="flex items-center"
        >
          <span
            class="inline-block"
            :style="{ width: `calc(${row.depth} * 1rem)` }"
          />

          <u-button
            variant="link"
            color="neutral"
            class="mr-2"
            size="xs"
            :icon="row.getIsExpanded() ? icons.minus : icons.plus"
            @click="row.toggleExpanded()"
          />
          <!--@vue-expect-error-->
          <u-badge
            v-if="row.groupingColumnId === 'level'"
            :label="row.original.level"
            :color="levelColours[row.original.level] || 'primary'"
          />
        </div>
        <u-badge
          v-else-if="row.getIsGrouped()"
          :label="row.original.type"
          :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        />
      </template>
    </u-table>
  </div>
</template>
