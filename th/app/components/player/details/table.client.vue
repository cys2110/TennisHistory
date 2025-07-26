<script setup lang="ts">
// @ts-nocheck
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
const { active, tour, status, player } = defineProps<{
  active: boolean
  tour: TourType
  status: APIStatusType
  player: PlayerInterface | null
  first_name: string
  last_name: string
}>()
const {
  ui: { icons }
} = useAppConfig()
const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
})
const currentYear = new Date().getFullYear()

const coaches = computed(() => {
  interface newCoach {
    first_name: string
    last_name: string
    id: string
    dates: string[]
  }
  const allCoaches = [...(player?.coaches ?? []), ...(player?.former_coaches ?? [])]
  const combinedCoaches: newCoach[] = []
  const usedIds = new Set<string>()
  allCoaches.forEach(coach => {
    if (!usedIds.has(coach.id)) {
      const hasCoached = allCoaches?.filter(c => c.id === coach.id)
      const combinedCoach: newCoach = {
        first_name: coach.first_name,
        last_name: coach.last_name,
        id: coach.id,
        dates: []
      }

      for (const formerCoach of hasCoached ?? []) {
        if (formerCoach.start_date) {
          const dates =
            formerCoach.end_date ?
              formerCoach.start_date.year === formerCoach.end_date.year ?
                `${formerCoach.start_date.year}`
              : `${formerCoach.start_date.year} - ${formerCoach.end_date.year}`
            : `${formerCoach.start_date.year} - present`
          combinedCoach.dates.push(dates)
        }
      }

      combinedCoaches.push({
        ...combinedCoach,
        dates: combinedCoach.dates.sort()
      })
      usedIds.add(coach.id)
    }
  })
  return useSorted(combinedCoaches, (a, b) => {
    const dateA = a.dates[0] ?? "9999"
    const dateB = b.dates[0] ?? "9999"
    return dateA.localeCompare(dateB)
  }).value
})

const playerDetails = computed(() => {
  if (player) {
    return [
      {
        title: "Career Prize Money",
        value:
          player.pm?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
          }) ?? "Unknown"
      },
      {
        title: "Age",
        value: player.age ? `${player.age} years` : "Unknown",
        description:
          player.dod && player.dob ? `${dateTimeFormat.formatRange(getDate(player.dob))} - ${dateTimeFormat.format(getDate(player.dod))}`
          : player.dob ? dateTimeFormat.format(getDate(player.dob))
          : undefined
      },
      {
        title: "Height",
        value: player.height ? `${player.height} cm` : "Unknown",
        description: player.height ? convertToFt(player.height) : undefined
      },
      {
        title: "Plays",
        value: isDefined(player.rh) ? handedness(player.rh) : "Unknown"
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
        title: coaches.value.length === 1 ? "Coach" : "Coaches",
        value: coaches.value.map(c => ({ ...c }))
      },
      {
        title: "Previous Representations",
        value: player.countries.map(r => ({ ...r }))
      }
    ]
  }
  return []
})

const statsDetails = computed(() => {
  if (player) {
    return [
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
      },
      {
        title: "Date",
        singles: player.singles_ch_date ? useDateFormat(getDate(player.singles_ch_date), "DD MMMM YYYY") : "—",
        doubles: player.doubles_ch_date ? useDateFormat(getDate(player.doubles_ch_date), "DD MMMM YYYY") : "—"
      }
    ]
  }
  return []
})

const winLossData = computed(() => {
  const levels = ["Tour", "Challenger", "ITF"]
  if (player) {
    const singles_wl = levels.map(level => ({
      level,
      type: "Singles",
      wins: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_wins`)?.total ?? 0,
      losses: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_losses`)?.total ?? 0,
      q_wins: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_q_wins`)?.total ?? 0,
      q_losses: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_q_losses`)?.total ?? 0,
      titles: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_titles`)?.total ?? 0
    }))
    const doubles_wl = levels.map(level => ({
      level,
      type: "Doubles",
      wins: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_wins`)?.total ?? 0,
      losses: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_losses`)?.total ?? 0,
      q_wins: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_q_wins`)?.total ?? 0,
      q_losses: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_q_losses`)?.total ?? 0,
      titles: player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_titles`)?.total ?? 0
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
  }
  return []
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
  { accessorKey: "type", header: "Singles/Doubles" },
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
      :loading="status === 'pending'"
      :empty="`No details found for ${first_name} ${last_name}`"
    >
      <template #value-cell="{ row }">
        <div
          v-if="row.original.title && ['Coach', 'Coaches'].includes(row.original.title)"
          class="flex flex-col gap-1 w-fit mx-auto"
        >
          <div
            v-for="coach in row.original.value"
            :key="coach.id"
          >
            <u-link
              :to="{
                name: 'coach',
                params: { id: kebabCase(coach.id) }
              }"
              class="hover-link"
            >
              {{ coach.first_name ? `${coach.first_name} ${coach.last_name}` : coach.id }}
            </u-link>
            <div
              v-if="coach.dates?.length"
              class="font-medium text-xs"
            >
              {{ coach.dates.join(", ") }}
            </div>
          </div>
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
                params: { id: country.id, name: kebabCase(country.name) }
              }"
              class="flex items-center gap-2"
            >
              <u-icon :name="getFlagCode(country)" />
              <span class="hover-link text-sm">{{ country.name }}</span>
            </u-link>
            <div class="font-medium text-xs">{{ dateTimeFormat.formatRange(getDate(country.start_date), getDate(country.end_date)) }}</div>
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
      :loading="status === 'pending'"
      :empty="`No stats found for ${first_name} ${last_name}`"
    >
    </u-table>

    <u-table
      :data="winLossData"
      :columns="wlColumns"
      :loading="status === 'pending'"
      sticky
      :grouping="['level']"
      :grouping-options="grouping_options"
      :ui="{
        root: 'mt-5 max-h-200 max-w-full min-w-full md:min-w-3/4 xl:min-w-1/2 mx-auto',
        td: 'empty:p-0' // helps with the colspaned row added for expand slot
      }"
      :empty="`No win-loss data available for ${first_name} ${last_name}`"
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
          <u-badge
            v-if="row.groupingColumnId === 'level'"
            :label="row.original.level"
            :color="
              row.original.level === 'Total' ? 'primary'
              : row.original.level === 'ITF' ? 'info'
              : (row.original.level.toLowerCase() as 'challenger' | 'tour')
            "
          />
        </div>
      </template>

      <template #type-cell="{ row }">
        <u-badge
          v-if="!row.getIsGrouped()"
          :label="row.original.type"
          :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
        />
      </template>
    </u-table>
  </div>
</template>
