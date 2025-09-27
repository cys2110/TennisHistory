<script setup lang="ts">
const { match } = defineProps<{ match: MatchInterface }>()
const {
  params: { name, id, year, eid, mid }
} = useRoute("match")
const { tour, draw, type } = destructureMid(mid) as { tour: TourType; draw: DrawType; type: MatchType }

const duration = computed(() => {
  if (match.duration) {
    const { hours, minutes, seconds } = match.duration
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return "00:00:00"
})
</script>

<template>
  <table class="text-sm w-fit mx-auto">
    <tbody class="[&>tr>th]:text-muted [&>tr>th]:p-1 [&>tr>td]:p-1 [&>tr>th]:text-left">
      <tr>
        <th>Surface</th>
        <td>
          {{ match.surface.id }}
        </td>
        <th>{{ match.date ? "Date" : "Dates" }}</th>
        <td>
          {{
            match.date
              ? useDateFormat(getDate(match.date), "dddd DD MMMM, YYYY")
              : dateTimeFormat.formatRange(getDate(match.start_date), getDate(match.end_date))
          }}
        </td>
      </tr>
      <tr>
        <th>Duration</th>
        <td>{{ duration }}</td>
        <th>{{ type === "Singles" ? "Player 1" : "Team 1" }}</th>
        <td class="flex flex-col">
          <player-link
            v-for="player in match.p1"
            :key="player.id"
            :player
          />
        </td>
      </tr>
      <tr>
        <th>Court</th>
        <td>{{ match.court ?? "—" }}</td>
        <th>{{ type === "Singles" ? "Player 2" : "Team 2" }}</th>
        <td class="flex flex-col">
          <player-link
            v-for="player in match.p2"
            :key="player.id"
            :player
          />
        </td>
      </tr>
      <tr>
        <th>Umpire</th>
        <td>{{ match.umpire ?? "—" }}</td>
        <th>Score</th>
        <td>
          <match-score-item
            :draw
            :tour
            :type
            :sets="match.sets"
            :id="parseInt(eid)"
            :year="parseInt(year)"
            :match_no="match.match_no"
            :tournament="{ id: parseInt(id), name }"
            :incomplete="match.p1_incomplete || match.p2_incomplete"
            :stats="false"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
