<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core"
defineProps<{ match: Pick<MatchType, "round" | "incomplete" | "winner_id" | "p1" | "p2" | "mid"> }>()
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
</script>

<template>
  <u-page-card
    highlight
    class="min-w-[350px]"
  >
    <Handle
      type="source"
      :position="Position.Right"
    />
    <template #title>{{ match.round }}</template>

    <template #description>
      <div class="grid grid-flow-col grid-rows-2 items-center gap-2 mt-5">
        <player-avatar
          v-if="match.p1"
          :player="match.p1"
        />
        <div v-else>BYE</div>
        <player-avatar
          v-if="match.p2"
          :player="match.p2"
        />
        <div v-else>BYE</div>
        <small>{{ match.p1?.seed || match.p1?.status ? `(${match.p1.seed ?? ""}${match.p1.status ?? ""})` : "" }}</small>
        <small>{{ match.p2?.seed || match.p2?.status ? `(${match.p2.seed ?? ""}${match.p2.status ?? ""})` : "" }}</small>
        <div>
          <u-icon
            v-if="match.p1?.id === match.winner_id"
            :name="ICONS.check"
            class="text-green-600 dark:text-green-300 text-lg"
          />
          <u-badge
            v-else-if="match.p1?.incomplete"
            color="error"
            :label="`${match.p1.incomplete}.`"
          />
        </div>
        <div>
          <u-icon
            v-if="match.p2?.id === match.winner_id"
            :name="ICONS.check"
            class="text-green-600 dark:text-green-300 text-lg"
          />
          <u-badge
            v-else-if="match.p2?.incomplete"
            color="error"
            :label="`${match.p2.incomplete}.`"
          />
        </div>
        <div class="text-right">
          <template
            v-for="(set, index) in match.p1.sets"
            :key="`p1-${index}`"
          >
            <!--prettier-ignore-->
            <span v-if="set" class="mr-2">
              {{ set }}<sup v-if="match.p1.tbs[index]">{{ match.p1.tbs[index] }}</sup>
            </span>
          </template>
        </div>
        <div class="text-right">
          <template
            v-for="(set, index) in match.p2.sets"
            :key="`p2-${index}`"
          >
            <!--prettier-ignore-->
            <span v-if="set" class="mr-2">
              {{ set }}<sup v-if="match.p2.tbs[index]">{{ match.p2.tbs[index] }}</sup>
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
          :disabled="!!match.incomplete"
          :to="{ name: 'match', params: { name, tid, year, eid, mid: match.mid } }"
        />
        <u-button
          label="H2H"
          variant="subtle"
          color="secondary"
          :icon="ICONS.swords"
          :to="{ name: 'h2h-players', params: { p1Name: useChangeCase(match.p1.name, 'kebabCase').value, p1Id: match.p1.id, p2Name: useChangeCase(match.p2.name, 'kebabCase').value, p2Id: match.p2.id } }"
        />
      </u-button-group>
    </template>
    <Handle
      type="target"
      :position="Position.Left"
    />
  </u-page-card>
</template>
