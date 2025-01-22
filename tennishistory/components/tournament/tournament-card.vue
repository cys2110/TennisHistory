<script setup lang="ts">
const props = defineProps<{ event: TournamentEventType }>()
const route = useRoute()
const { name, tid } = route.params
const { year, winner_country, winner_id, winner_name, loser_country, loser_id, loser_name, eid, match_no } = props.event
</script>

<template>
  <u-card :id="year">
    <template #header>{{ year }}</template>

    <u-container class="text-sm">
      <div class="flex items-center gap-2">
        <flag-icon
          v-if="winner_country"
          :country="winner_country"
        />
        <player-avatar
          v-if="winner_id && winner_name"
          :id="winner_id"
          :name="winner_name"
        />
        <nuxt-link
          v-if="winner_name && winner_id"
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(winner_name, 'kebabCase').value, id: winner_id } }"
        >
          {{ winner_name }}
        </nuxt-link>
      </div>
      <div class="text-center text-xs">d.</div>
      <div class="flex items-center gap-2">
        <flag-icon
          v-if="loser_country"
          :country="loser_country"
        />
        <player-avatar
          v-if="loser_id && loser_name"
          :id="loser_id"
          :name="loser_name"
        />
        <nuxt-link
          v-if="loser_name && loser_id"
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(loser_name, 'kebabCase').value, id: loser_id } }"
        >
          {{ loser_name }}
        </nuxt-link>
      </div>
      <div class="text-center">
        <score-item
          :name="name as string"
          :tid="tid as string"
          :year
          :eid
          :match_no
          :event
        />
      </div>
    </u-container>

    <template #footer>
      <event-buttons
        :name="name as string"
        :tid="tid as string"
        :year="event.year"
        :eid="event.eid"
      />
    </template>
  </u-card>
</template>
