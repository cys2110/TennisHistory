<script setup lang="ts">
defineProps<{ entry: ConsolidatedEntryType; viewType: boolean }>()
const {
  ui: { icons }
} = useAppConfig()

const getTypeColor = (type: string) => {
  switch (type) {
    case "Main Singles":
      return "singles"
    case "Qualifying Singles":
      return "active"
    case "Main Doubles":
      return "doubles"
    case "Qualifying Doubles":
      return "inactive"
    default:
      return "neutral"
  }
}
</script>

<template>
  <u-card
    :class="entry.tour === 'ATP' ? 'ring-atp' : 'ring-wta'"
    :ui="{
      body: 'flex-1',
      root: 'h-full flex flex-col'
    }"
  >
    <template #header>
      <u-badge
        v-for="type in entry.type"
        :key="type"
        :label="type"
        :color="getTypeColor(type)"
        class="mx-1"
      />
    </template>

    <div class="flex flex-wrap items-center gap-1 my-auto h-full">
      <template
        v-for="(player, index) in entry.players"
        :key="player.id"
      >
        <u-separator
          v-if="index > 0"
          orientation="vertical"
          class="h-4"
        />
        <player-link :player="{ ...player, tour: entry.tour }" />
      </template>
    </div>

    <template #footer>
      <div class="flex flex-wrap gap-1">
        <u-badge
          v-if="entry.players[0].singles_rank"
          :label="`Singles Rank: ${entry.players[0].singles_rank}`"
          color="singles"
        />
        <u-badge
          v-if="entry.players[0].doubles_rank || entry.players[1]?.doubles_rank"
          color="doubles"
        >
          Doubles Rank:
          {{ entry.players[0].doubles_rank ?? 0 }}
          <u-separator
            v-if="viewType"
            orientation="vertical"
            class="h-4"
          />
          {{ entry.players[1]?.doubles_rank ?? (viewType ? 0 : "") }}
        </u-badge>
        <u-badge
          v-if="entry.singles_seed"
          :label="`Seed: ${entry.singles_seed}`"
          color="singles"
        />
        <u-badge
          v-if="entry.doubles_seed"
          :label="`Seed: ${entry.doubles_seed}`"
          color="doubles"
        />
        <u-badge
          v-if="entry.singles_q_seed"
          :label="`Q Seed: ${entry.singles_q_seed}`"
          color="active"
        />
        <u-badge
          v-if="entry.doubles_q_seed"
          :label="`Q Seed: ${entry.doubles_q_seed}`"
          color="inactive"
        />
        <u-badge
          v-if="entry.singles_status"
          :label="STATUSES[entry.singles_status].longName"
          color="singles"
        />
        <u-badge
          v-if="entry.doubles_status"
          :label="STATUSES[entry.doubles_status].longName"
          color="doubles"
        />
        <u-badge
          v-if="entry.singles_q_status"
          :label="STATUSES[entry.singles_q_status].longName"
          color="active"
        />
        <u-badge
          v-if="entry.doubles_q_status"
          :label="STATUSES[entry.doubles_q_status].longName"
          color="inactive"
        />
        <u-badge
          v-if="entry.singles_withdrawn"
          :icon="icons.error"
          :color="entry.type.includes('Main Singles') ? 'singles' : 'active'"
          label="Withdrew"
        />
        <u-badge
          v-if="entry.doubles_withdrawn"
          :icon="icons.error"
          :color="entry.type.includes('Main Doubles') ? 'doubles' : 'inactive'"
          label="Withdrew"
        />
      </div>
    </template>
  </u-card>
</template>
