<script setup lang="ts">
const {
  params: { eid, year }
} = useRoute("event")
const {
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: teams, status } = await useFetch<EntryInfoInterface[]>("/api/events/entry-info", {
  key: `event-entry-info-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const groupedTeams = computed(() => {
  if (teams.value.length) {
    const relationships = useArrayUnique(teams.value.map(team => team.label))

    return relationships.value.map(label => ({
      label,
      teams: teams.value.filter(team => team.label === label)
    }))
  }

  return []
})
</script>

<template>
  <dashboard-subpanel
    id="entry-info"
    title="Entry Information"
    :icon="uIcons.info"
  >
    <template #right>
      <event-entry-info-chart
        v-if="teams.length && mdAndUp"
        :teams
      />
    </template>

    <u-collapsible
      v-if="groupedTeams.length"
      v-for="item in groupedTeams"
      :key="item.label"
    >
      <u-button
        class="group my-2"
        :label="`${item.label}s`"
        color="neutral"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        block
        :trailing-icon="uIcons.chevronDown"
      />

      <template #content>
        <div
          v-for="(team, index) in item.teams"
          :key="`${item.label}-${index}`"
          class="flex justify-between items-center text-sm gap-3 my-1"
        >
          <div class="flex items-center gap-2">
            <u-badge
              :color="getTourColour(team.tour)"
              :label="team.tour"
            />
            <u-badge
              :color="getMatchTypeColour(team.type)"
              :label="team.type"
            />
            <u-badge
              :color="team.draw === 'Main' ? 'main' : 'qualifying'"
              :label="team.draw"
            />
            <template
              v-for="(player, idx) in team.team"
              :key="player.id"
            >
              <u-separator
                v-if="idx > 0"
                orientation="vertical"
                class="h-4"
              />
              <player-link :player />
            </template>
          </div>

          <div>
            <span v-if="item.label === 'Last Direct Acceptance'">{{ team.status === "PR" ? "P" : "" }}{{ team.rank }}</span>
            <span v-else-if="['Withdrawal', 'Retirement', 'Walkover'].includes(item.label)">
              {{
                team.team[0]?.reason && team.team[0].reason !== "teammate" ?
                  `${team.type === "Singles" ? "" : `${team.team[0].last_name} - `} ${team.team[0].reason}`
                : team.team[1]?.reason && team.team[1].reason !== "teammate" ? `${team.team[1].last_name} - ${team.team[1].reason}`
                : team.team_reason
              }}
            </span>
          </div>
        </div>
      </template>
    </u-collapsible>
    <error-message
      v-else
      :message="`No entry information available for ${tournamentName} ${year}`"
    />
  </dashboard-subpanel>
</template>
