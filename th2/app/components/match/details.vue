<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"

const {
  ui: { icons }
} = useAppConfig()
const { match } = defineProps<{ match: MatchDetailsType }>()
const calendarDate = computed(() => {
  if (match.match.date) {
    const { year, month, day } = match.match.date
    return new CalendarDate(year, month, day)
  } else {
    const {
      start_date: { year: startYear, month: startMonth, day: startDay },
      end_date: { year: endYear, month: endMonth, day: endDay }
    } = match
    return { start: new CalendarDate(startYear, startMonth, startDay), end: new CalendarDate(endYear, endMonth, endDay) }
  }
})
const duration = computed(() => {
  if (match.match.duration) {
    const { hours, minutes, seconds } = match.match.duration
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return "00:00:00"
})
</script>

<template>
  <div class="flex flex-col md:flex-row flex-wrap gap-8 max-w-full mx-auto">
    <!--Match Details-->
    <div class="border-2 border-primary-700 p-5 rounded-xl flex flex-row justify-between max-w-fit h-fit m-auto gap-8 text-xs md:text-sm">
      <div class="flex flex-col justify-evenly gap-3">
        <div>Surface</div>
        <div>Duration</div>
        <div>Court</div>
        <div>Umpire</div>
      </div>
      <div class="flex flex-col justify-evenly items-end gap-3 font-semibold">
        <u-link
          v-if="match.surface"
          :to="{ name: 'surface', params: { id: kebabCase(match.surface.id) } }"
          class="hover-link"
        >
          {{ match.surface.id }}
        </u-link>
        <span>{{ duration }}</span>
        <span>{{ match.match.court ?? "—" }}</span>
        <u-link
          v-if="match.match.umpire"
          :to="{ name: 'umpire', params: { id: kebabCase(match.match.umpire) } }"
          class="hover-link"
        >
          {{ match.match.umpire }}
        </u-link>
        <span v-else>—</span>
      </div>
    </div>

    <!--Score box-->
    <div
      class="flex-1 border-2 border-primary-700 p-5 rounded-xl flex justify-between h-fit my-auto text-xs md:text-sm md:order-last md:min-w-fit lg:min-w-0"
    >
      <!--Players-->
      <div class="flex flex-col gap-5 min-h-full justify-evenly">
        <div class="flex flex-wrap items-center gap-2">
          <template
            v-for="(player, index) in match.match.p1"
            :key="player.id"
          >
            <u-separator
              v-if="index === 1"
              orientation="vertical"
              class="h-4"
            />
            <player-link :player />
            <small v-if="player.rank || player.rank === 0">[{{ player.rank }}]</small>
          </template>
          <small>
            {{ match.match.p1[0]?.seed || match.match.p1[0]?.status ? `(${match.match.p1[0]?.seed ?? ""}${match.match.p1[0]?.status ?? ""})` : "" }}
          </small>
          <div class="flex items-center">
            <u-icon
              v-if="match.match.p1_winner"
              :name="icons.success"
              class="text-success text-lg"
            />
            <u-badge
              v-else-if="match.match.player_incomplete[0]"
              color="error"
              :label="`${match.match.player_incomplete[0]}.`"
            />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <template
            v-for="(player, index) in match.match.p2"
            :key="player.id"
          >
            <u-separator
              v-if="index === 1"
              orientation="vertical"
              class="h-4"
            />
            <player-link :player />
            <small v-if="player.rank || player.rank === 0">[{{ player.rank }}]</small>
          </template>
          <small>
            {{ match.match.p2[0]?.seed || match.match.p2[0]?.status ? `(${match.match.p2[0]?.seed ?? ""}${match.match.p2[0]?.status ?? ""})` : "" }}
          </small>
          <div class="flex items-center">
            <u-icon
              v-if="!match.match.p1_winner"
              :name="icons.success"
              class="text-success text-lg"
            />
            <u-badge
              v-else-if="match.match.player_incomplete[1]"
              color="error"
              :label="`${match.match.player_incomplete[1]}.`"
            />
          </div>
        </div>
      </div>

      <!--Scores-->
      <div class="flex flex-col gap-5 min-h-full justify-evenly">
        <div
          v-for="(x, index) in match.match.sets"
          :key="`p-${index}`"
          :class="`grid grid-cols-5 gap-1`"
        >
          <div v-if="match.match.sets[index] && match.match.sets[index].length < 5" />
          <div v-if="match.match.sets[index] && match.match.sets[index].length < 4" />
          <template
            v-for="(s, idx) in x"
            :key="`p-${index}-${idx}`"
          >
            <!--prettier-ignore-->
            <span class="text-center" :class="{ 'font-semibold': s > (match.match.sets?.[index === 0 ? 1 : 0]?.[idx] ?? 0) && (match.match.sets?.[index === 0 ? 1 : 0]?.[idx] !== undefined) }">{{ s[0] }}<sup v-if="isDefined(s[1])">{{ s[1] }}</sup></span>
          </template>
        </div>
      </div>
    </div>

    <!--Date-->
    <div class="border-2 border-primary-700 p-5 rounded-xl text-xs sm:text-sm max-w-fit m-auto lg:order-last">
      <u-calendar
        :range="match.match.date ? false : true"
        v-model="calendarDate"
        disabled
        :month-controls="false"
        :year-controls="false"
        :fixed-weeks="false"
        size="xs"
      />
    </div>
  </div>
</template>
