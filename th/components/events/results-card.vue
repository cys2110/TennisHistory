<script setup lang="ts">
const { match } = defineProps<{ match: ResultsMatchType }>()
const name = useRouteParams<string>("name")
const id = useRouteParams<string>("id")
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")

const sets = computed(() => {
  const filteredSets = match.winner.sets.filter(set => set !== null)
  return filteredSets.length
})
</script>

<template>
  <u-page-card
    highlight
    :ui="{ body: 'w-full', title: 'text-sm' }"
  >
    <template #title>
      <div class="flex flex-col">
        <div class="flex justify-between">
          <span v-if="match.date">{{ match.date }}</span>
          <span class="justify-self-end">{{ match.duration ?? "00:00" }}</span>
        </div>
        <div class="flex justify-between">
          <div v-if="match.court">{{ match.court }}</div>
          <div v-if="match.umpire">{{ match.umpire }}</div>
        </div>
      </div>
    </template>

    <template #description>
      <div class="grid grid-flow-col grid-rows-2 items-center gap-2 mt-5">
        <player-avatar :player="match.winner" />
        <player-avatar :player="match.loser" />
        <small>{{ match.winner.seed || match.winner.status ? `(${match.winner.seed ?? ""}${match.winner.status ?? ""})` : "" }}</small>
        <small>{{ match.loser.seed || match.loser.status ? `(${match.loser.seed ?? ""}${match.loser.status ?? ""})` : "" }}</small>
        <u-icon
          :name="ICONS.success"
          class="text-success-600 dark:text-success-300 text-lg"
        />
        <div>
          <u-badge
            v-if="match.loser.incomplete"
            color="error"
            :label="`${match.loser.incomplete}.`"
          />
        </div>
        <div :class="`grid grid-cols-${sets}`">
          <template
            v-for="(set, index) in match.winner.sets"
            :key="`winner-${index}`"
          >
            <!--prettier-ignore-->
            <span v-if="set" class="mr-2">
              {{ set }}<sup v-if="match.winner.tbs[index]">{{ match.winner.tbs[index] }}</sup>
            </span>
          </template>
        </div>
        <div :class="`grid grid-cols-${sets}`">
          <template
            v-for="(set, index) in match.loser.sets"
            :key="`loser-${index}`"
          >
            <!--prettier-ignore-->
            <span v-if="set" class="mr-2">
              {{ set }}<sup v-if="match.loser.tbs[index]">{{ match.loser.tbs[index] }}</sup>
          </span>
          </template>
        </div>
      </div>
    </template>

    <template #footer>
      <u-button-group size="sm">
        <u-button
          label="Stats"
          :icon="ICONS.stats"
          :to="{ name: 'match', params: { name, id, year, eid, mid: match.mid } }"
          :disabled="!!match.incomplete"
        />
        <u-button
          label="H2H"
          :icon="ICONS.h2h"
          :to="{ name: 'h2h-players', params: { p1Name: encodeName(match.winner.name), p1Id: match.winner.id, p2Name: encodeName(match.loser.name), p2Id: match.loser.id } }"
        />
      </u-button-group>
    </template>
  </u-page-card>
</template>
