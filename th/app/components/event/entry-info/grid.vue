<script setup lang="ts">
const { data, status } = defineProps<{ data: EntryInfoType[]; status: APIStatusType }>()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const { params } = useRoute()
const { year, name } = params as { year: string; name: string }
</script>

<template>
  <u-collapsible
    v-if="data.length"
    v-for="item in data"
    :key="item.label"
  >
    <u-button
      class="group my-2"
      :label="item.label"
      color="neutral"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      block
      :trailing-icon="appIcons.chevronDown"
    />

    <template #content>
      <div
        v-for="(team, index) in item.teams"
        :key="`${item.label}-${index}`"
        class="flex justify-between items-center text-sm gap-5 space-y-3"
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
            v-for="(player, idx) in team.players"
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
          <span v-if="item.label === 'LDA'">{{ team.status === "PR" ? "P" : "" }}{{ team.rank }}</span>
          <span v-else-if="['WITHDREW', 'RETIRED', 'WALKOVER'].includes(item.label)">
            {{
              team.players[0]?.reason ? `${team.type === "Singles" ? "" : `${team.players[0].last_name} - `} ${team.players[0].reason}`
              : team.players[1]?.reason ? `${team.players[1].last_name} - ${team.players[1].reason}`
              : team.team_reason
            }}
          </span>
        </div>
      </div>
    </template>
  </u-collapsible>
  <error-message
    v-else
    :icon="icons.noChart"
    :message="`No entry information found for ${name} ${year}`"
  />
</template>
