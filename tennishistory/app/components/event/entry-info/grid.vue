<script setup lang="ts">
const { teams } = defineProps<{
  teams: EntryInfoInterface[]
  status: APIStatusType
}>()
const {
  ui: { icons }
} = useAppConfig()
const {
  params: { year }
} = useRoute()
const tournament = inject<TournamentInterface>("tournament")

const groupedTeams = computed(() => {
  if (teams.length) {
    const relationships = useArrayUnique(teams.map(team => team.label))

    return relationships.value.map(label => ({
      label,
      teams: teams.filter(team => team.label === label)
    }))
  }

  return []
})
</script>

<template>
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
      :trailing-icon="icons.chevronDown"
    />

    <template #content>
      <div
        v-for="(team, index) in item.teams"
        :key="`${item.label}-${index}`"
        class="flex justify-between items-center text-sm gap-3"
      >
        <div class="flex items-center gap-2">
          <u-badge
            :color="getTourColor([team.tour])"
            :label="team.tour"
          />
          <u-badge
            :color="team.type === 'Singles' ? 'singles' : 'doubles'"
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
    :message="`No entry information available for ${tournament?.name} ${year}`"
  />
</template>
