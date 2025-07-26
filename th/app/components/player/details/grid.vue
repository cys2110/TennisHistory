<script setup lang="ts">
const { active, tour, status, player } = defineProps<{
  active: boolean
  tour: TourType
  status: APIStatusType
  player: PlayerInterface
  first_name: string
  last_name: string
}>()
const { icons } = useAppConfig()
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
  const allCoaches = [...(player.coaches ?? []), ...(player.former_coaches ?? [])]
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

const consolidatedWL = computed(() => {
  const levels = ["Tour", "Challenger", "ITF"]
  const all_wl = levels.map(level => {
    const singles_wins = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_wins`)?.total ?? 0
    const singles_losses = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_losses`)?.total ?? 0
    const doubles_wins = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_wins`)?.total ?? 0
    const doubles_losses = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_losses`)?.total ?? 0
    const singles_q_wins = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_q_wins`)?.total ?? 0
    const singles_q_losses = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_q_losses`)?.total ?? 0
    const doubles_q_wins = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_q_wins`)?.total ?? 0
    const doubles_q_losses = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_doubles_q_losses`)?.total ?? 0

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
    const singles = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_titles`)?.total
    const doubles = player.wl?.find(wl => wl.label === `${level.toLowerCase()}_singles_titles`)?.total
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
    <u-page-columns class="lg:columns-2 xl:columns-3">
      <details-card
        title="Ranking"
        :tour
      >
        <template #description>
          <div class="flex flex-col gap-1">
            <div class="grid grid-cols-3 text-sm text-dimmed">
              <span></span>
              <span>Singles</span>
              <span>Doubles</span>
            </div>
            <div class="grid grid-cols-3">
              <div class="text-sm font-semibold text-dimmed"> Current </div>
              <div class="text-sm font-extrabold">
                {{ player.current_singles ?? "—" }}
              </div>
              <div class="text-sm font-extrabold">
                {{ player.current_doubles ?? "—" }}
              </div>
            </div>
            <div class="grid grid-cols-3">
              <div class="text-sm font-semibold text-dimmed"> High </div>
              <div class="text-sm font-extrabold">
                {{ player.ch_singles ?? "—" }}
              </div>
              <div class="text-sm font-extrabold">
                {{ player.ch_doubles ?? "—" }}
              </div>
            </div>
            <div class="grid grid-cols-3">
              <div class="text-sm font-semibold text-dimmed"> Date </div>
              <div class="text-sm font-extrabold">
                {{ player.singles_ch_date ? dateTimeFormat.format(getDate(player.singles_ch_date)) : "—" }}
              </div>
              <div class="text-sm font-extrabold">
                {{ player.doubles_ch_date ? dateTimeFormat.format(getDate(player.doubles_ch_date)) : "—" }}
              </div>
            </div>
          </div>
        </template>
      </details-card>

      <details-card
        title="Titles"
        :tour
      >
        <template #description>
          <div class="flex flex-col gap-1">
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
        </template>
      </details-card>

      <details-card
        title="Win-Loss"
        :tour
      >
        <template #description>
          <div class="flex flex-col gap-1">
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
        </template>
      </details-card>

      <details-card
        title="Career Prize Money"
        :tour
        :value="player.pm?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })"
      />

      <details-card
        title="Age"
        :tour
        :value="player.age ? `${player.age} years` : 'Unknown'"
        :description="
          player.dod && player.dob ? `${dateTimeFormat.formatRange(getDate(player.dob), getDate(player.dod))}`
          : player.dob ? dateTimeFormat.format(getDate(player.dob))
          : undefined
        "
      />

      <details-card
        title="Height"
        :tour
        :value="player.height ? `${player.height} cm` : 'Unknown'"
        :description="player.height ? convertToFt(player.height) : undefined"
      />

      <details-card
        title="Plays"
        :tour
        :value="isDefined(player.rh) ? handedness(player.rh) : 'Unknown'"
      />

      <details-card
        title="Backhand"
        :tour
        :value="player.bh ? `${player.bh}-Handed` : 'Unknown'"
      />

      <details-card
        v-if="player.turned_pro || player.retired"
        :title="
          player.turned_pro && player.retired ? 'Turned pro'
          : player.turned_pro ? 'Turned pro'
          : 'Retired'
        "
        :tour
        :value="player.turned_pro ? player.turned_pro : 'Unknown'"
        :description="
          player.turned_pro && player.retired ? `${player.retired - player.turned_pro} years`
          : player.turned_pro && active ? `${currentYear - player.turned_pro} years`
          : undefined
        "
      />

      <details-card
        v-if="player.hof"
        :tour
        title="Hall of Fame Induction"
        :value="player.hof"
      />

      <details-card
        title="Coaches"
        :tour
      >
        <template #description>
          <div
            v-for="coach in coaches"
            :key="coach.id"
            class="flex flex-col gap-0"
          >
            <u-link
              :to="{ name: 'coach', params: { id: kebabCase(coach.id) } }"
              class="hover-link font-semibold"
            >
              {{ coach.first_name ? `${coach.first_name} ${coach.last_name}` : coach.id }}
            </u-link>
            <span class="text-sm text-dimmed">({{ coach.dates.join(", ") }})</span>
          </div>
        </template>
      </details-card>

      <details-card
        v-if="player.countries.length"
        title="Previous Representations"
        :tour
      >
        <template #description>
          <div
            v-for="country in player.countries"
            :key="country.id"
            class="my-2"
          >
            <country-link
              :country
              :icon-only="false"
              class="text-sm font-semibold mx-auto w-fit"
            />
            <span
              v-if="country.start_date && country.end_date"
              class="text-sm text-dimmed"
            >
              {{ dateTimeFormat.formatRange(getDate(country.start_date), getDate(country.end_date)) }}
            </span>
          </div>
        </template>
      </details-card>

      <details-card
        title="Most Frequent H2H"
        :tour
      >
        <template #description>
          <div
            v-for="h2h in player.h2h"
            :key="h2h.opponent.id"
            class="flex items-center justify-between"
          >
            <player-link :player="h2h.opponent" />
            <div>{{ h2h.wins }}-{{ h2h.matches - h2h.wins }}</div>
          </div>
        </template>
      </details-card>
    </u-page-columns>
  </div>
  <u-page-columns
    v-else-if="status === 'pending'"
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
    :message="`No details found for ${first_name} ${last_name}`"
  />
</template>
