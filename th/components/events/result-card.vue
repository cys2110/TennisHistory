<script setup lang="ts">
defineProps<{ match: Pick<MatchType, "mid" | "date" | "court" | "duration" | "incomplete" | "umpire" | "winner" | "loser"> }>()
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
</script>

<template>
  <u-page-card
    highlight
    :ui="{ body: 'w-full', title: 'text-slate-500 dark:text-slate-400 text-sm' }"
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
          :name="ICONS.check"
          class="text-green-600 dark:text-green-300 text-lg"
        />
        <div>
          <u-badge
            v-if="match.loser.incomplete"
            color="error"
            :label="`${match.loser.incomplete}.`"
          />
        </div>
        <div class="text-right">
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
        <div class="text-right">
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
          variant="subtle"
          color="secondary"
          :icon="ICONS['line-scatter']"
          :to="{ name: 'match', params: { name, tid, year, eid, mid: match.mid } }"
          :disabled="!!match.incomplete"
        />
        <u-button
          label="H2H"
          variant="subtle"
          color="secondary"
          :icon="ICONS.swords"
          :to="{ name: 'h2h-players', params: { p1Name: useChangeCase(match.winner.name, 'kebabCase').value, p1Id: match.winner.id, p2Name: useChangeCase(match.loser.name, 'kebabCase').value, p2Id: match.loser.id } }"
        />
      </u-button-group>
    </template>
  </u-page-card>
</template>
