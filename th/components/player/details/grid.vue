<script setup lang="ts">
const { active, tour, status, player } = defineProps<{
  active: boolean
  tour: TourType
  status: APIStatusType
  player: PlayerDetailsType
}>()
const { icons } = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
const currentYear = new Date().getFullYear()

const playerDetails = computed(() => [
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
  { title: "Titles" },
  { title: "Win-Loss" },
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
  { title: player.coaches.length === 1 ? "Coach" : "Coaches" },
  { title: "Previous Representations" }
])

const consolidatedWL = computed(() => {
  const levels = ["Tour", "Challenger", "ITF"]
  const all_wl = levels.map(level => {
    const singles_wins = player[`${level.toLowerCase()}_singles_wins` as keyof typeof player] || 0
    const singles_losses = player[`${level.toLowerCase()}_singles_loss` as keyof typeof player] || 0
    const doubles_wins = player[`${level.toLowerCase()}_doubles_wins` as keyof typeof player] || 0
    const doubles_losses = player[`${level.toLowerCase()}_doubles_loss` as keyof typeof player] || 0
    const singles_q_wins = player[`${level.toLowerCase()}_q_singles_wins` as keyof typeof player] || 0
    const singles_q_losses = player[`${level.toLowerCase()}_q_singles_loss` as keyof typeof player] || 0
    const doubles_q_wins = player[`${level.toLowerCase()}_q_doubles_wins` as keyof typeof player] || 0
    const doubles_q_losses = player[`${level.toLowerCase()}_q_doubles_loss` as keyof typeof player] || 0

    return {
      level,
      singles_wins,
      singles_losses,
      doubles_wins,
      doubles_losses,
      singles_q_wins,
      singles_q_losses,
      doubles_q_wins,
      doubles_q_losses
    }
  })

  type WinLossType = (typeof all_wl)[number]

  return [
    ...all_wl,
    {
      level: "Total",
      singles_wins: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.singles_wins), 0),
      singles_losses: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.singles_losses), 0),
      doubles_wins: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.doubles_wins), 0),
      doubles_losses: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.doubles_losses), 0),
      singles_q_wins: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.singles_q_wins), 0),
      singles_q_losses: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.singles_q_losses), 0),
      doubles_q_wins: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.doubles_q_wins), 0),
      doubles_q_losses: all_wl.reduce((sum, wl: WinLossType) => sum + Number(wl.doubles_q_losses), 0)
    }
  ]
})

const consolidatedTitles = computed(() => {
  const levels = ["Tour", "Challenger", "ITF"]
  const all_titles = levels.map(level => {
    const singles = player[`${level.toLowerCase()}_singles_titles` as keyof typeof player] || 0
    const doubles = player[`${level.toLowerCase()}_doubles_titles` as keyof typeof player] || 0
    return { level, singles, doubles }
  })

  type TitleType = (typeof all_titles)[number]

  return [
    ...all_titles,
    {
      level: "Total",
      singles: all_titles.reduce((sum, title: TitleType) => sum + Number(title.singles), 0),
      doubles: all_titles.reduce((sum, title: TitleType) => sum + Number(title.doubles), 0)
    }
  ]
})
</script>

<template>
  <div v-if="player">
    <u-page-columns class="lg:columns-2 xl:columns-3 2xl:columns-3">
      <details-card
        v-for="detail in playerDetails"
        :key="detail.title"
        :detail
        :tour
      >
        <template
          #description
          v-if="['Titles', 'Win-Loss', 'Coach', 'Coaches', 'Previous Representations'].includes(detail.title)"
        >
          <div
            v-if="detail.title === 'Titles'"
            class="flex flex-col gap-1"
          >
            <div class="grid grid-cols-3 text-sm text-dimmed">
              <span>Level</span>
              <span>Singles</span>
              <span>Doubles</span>
            </div>
            <div
              v-for="title in consolidatedTitles"
              :key="title.level"
              class="grid grid-cols-3"
            >
              <div class="text-sm font-semibold text-dimmed">
                {{ title.level }}
              </div>
              <div class="text-sm font-extrabold">
                {{ title.singles }}
              </div>
              <div class="text-sm font-extrabold">
                {{ title.doubles }}
              </div>
            </div>
          </div>
          <div
            v-else-if="detail.title === 'Win-Loss'"
            class="flex flex-col gap-1"
          >
            <div class="grid grid-cols-5 text-sm text-dimmed">
              <span></span>
              <span class="col-span-2">SINGLES</span>
              <span class="col-span-2">DOUBLES</span>
            </div>
            <div class="grid grid-cols-5 text-sm text-dimmed">
              <span>Level</span>
              <span>Main</span>
              <span>Qualifying</span>
              <span>Main</span>
              <span>Qualifying</span>
            </div>
            <div
              v-for="wl in consolidatedWL"
              :key="wl.level"
              class="grid grid-cols-5"
            >
              <div class="text-sm font-semibold text-dimmed">
                {{ wl.level }}
              </div>
              <div class="text-sm font-extrabold"> {{ wl.singles_wins }}-{{ wl.singles_losses }} </div>
              <div class="text-sm font-extrabold"> {{ wl.singles_q_wins }}-{{ wl.singles_q_losses }} </div>
              <div class="text-sm font-extrabold"> {{ wl.doubles_wins }}-{{ wl.doubles_losses }} </div>
              <div class="text-sm font-extrabold"> {{ wl.doubles_q_wins }}-{{ wl.doubles_q_losses }} </div>
            </div>
          </div>
          <div v-else-if="['Coach', 'Coaches'].includes(detail.title)">
            <div
              v-if="player.coaches.length"
              class="flex flex-col gap-1"
            >
              <u-link
                v-for="coach in player.coaches"
                :key="coach.id"
                :to="{
                  name: 'coach',
                  params: { id: encodeName(coach.id) }
                }"
                class="hover-link w-fit"
              >
                {{ coach.name ?? coach.id }}
              </u-link>
            </div>
            <div v-else>—</div>
          </div>
          <div v-else>
            <div
              v-for="country in player.countries"
              :key="country.id"
              class="grid grid-cols-2 items-center my-2"
            >
              <div class="flex items-center">
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
              </div>
              <span class="text-sm">{{ country.dates }}</span>
            </div>
          </div>
        </template>
      </details-card>
    </u-page-columns>
  </div>
  <u-page-columns
    v-else-if="['pending', 'idle'].includes(status)"
    class="lg:columns-2 xl:columns-3 2xl:columns-3"
  >
    <loading-base
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :icon="icons.noPlayer"
    :message="`No details found for ${name}`"
  />
</template>
