<script setup lang="ts">
const props = defineProps<{ match: EventResultsMatchType }>()
const route = useRoute()
const { tname, tid, year, eid } = route.params
const { court, date, duration, incomplete, loser_country, loser_id, loser_incomplete, loser_name, loser_seed, loser_status, mid, umpire, winner_country, winner_id, winner_name, winner_seed, winner_status, ...match } = props.match
</script>

<template>
  <u-card>
    <template #header>
      <div class="flex flex-col">
        <div class="flex justify-between">
          <div v-if="date">{{ date }}</div>
          <div class="justify-self-end">{{ duration ?? "00:00" }}</div>
        </div>
        <div class="flex justify-between">
          <div v-if="court">{{ court }}</div>
          <div v-if="umpire">{{ umpire }}</div>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-9 items-center gap-1 text-xs md:text-sm lg:text-xs xl:text-sm text-zinc-600 dark:text-zinc-300">
      <div>
        <flag-icon :country="winner_country" />
      </div>
      <div>
        <player-avatar
          :id="winner_id"
          :name="winner_name"
        />
      </div>
      <div>
        <nuxt-link
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(winner_name, 'kebabCase').value, id: winner_id } }"
        >
          {{ winner_name }}
        </nuxt-link>
      </div>
      <div>
        <small v-if="winner_seed || winner_status">({{ winner_seed }}{{ winner_status }})</small>
      </div>
      <div>
        <u-icon
          :name="ICONS.check"
          class="text-green-600"
        />
      </div>
      <div>
        <template
          v-for="(_, index) in new Array(5)"
          :key="index"
        >
          <span v-if="(match as any)[`ws${index + 1}`]">
            {{ (match as any)[`ws${index + 1}`] }}
            <sup v-if="(match as any)[`wt${index+1}`]">
              {{ (match as any)[`wt${index + 1}`] }}
            </sup>
          </span>
        </template>
      </div>

      <div>
        <flag-icon
          v-if="loser_country"
          :country="loser_country"
        />
      </div>

      <div>
        <player-avatar
          v-if="loser_id && loser_name"
          :id="loser_id"
          :name="loser_name"
        />
      </div>

      <div>
        <nuxt-link
          v-if="loser_id && loser_name"
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(loser_name, 'kebabCase').value, id: loser_id } }"
        >
          {{ loser_name }}
        </nuxt-link>
        <template v-else>BYE</template>
      </div>
    </div>

    <div class="flex justify-center items-center">
      <small v-if="loser_seed || loser_status">({{ loser_seed }}{{ loser_status }})</small>
    </div>

    <div>
      <u-badge
        v-if="loser_incomplete"
        color="error"
        :label="loser_incomplete"
      />
    </div>

    <div>
      <template
        v-for="(_, index) in new Array(5)"
        :key="index"
      >
        <span v-if="(match as any)[`ls${index + 1}`]">
          {{ (match as any)[`ls${index + 1}`] }}
          <sup v-if="(match as any)[`lt${index+1}`]">
            {{ (match as any)[`lt${index + 1}`] }}
          </sup>
        </span>
      </template>
    </div>

    <template #footer>
      <div class="flex justify-evenly">
        <u-button
          :disabled="!!incomplete"
          size="sm"
          :icon="ICONS['line-scatter']"
          :to="{ name: 'match', params: { tname, tid, year, eid, mid } }"
          label="Stats"
        />

        <u-button
          :disabled="incomplete === 'B'"
          size="sm"
          :icon="ICONS.swords"
          :to="{ name: 'h2h-page', params: { p1Name: useChangeCase(winner_name, 'kebabCase').value, p1Id: winner_id, p2Name: useChangeCase(loser_name ?? '', 'kebabCase').value, p2Id: loser_id } }"
          label="H2H"
        />
      </div>
    </template>
  </u-card>
</template>
