<script setup lang="ts">
const { players, status } = defineProps<{
  players: CountryNumberOneAPIResponseType
  status: APIStatusType
}>()

const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <u-alert
        color="singles"
        variant="subtle"
        title="Singles No. 1s"
        class="w-full text-center mb-5"
      />
      <u-page-grid
        v-if="players.singles_players.length || ['pending', 'idle'].includes(status)"
        class="xl:grid-cols-3 2xl:grid-cols-3"
      >
        <player-card
          v-if="players.singles_players.length"
          v-for="player in players.singles_players"
          :key="player.id"
          :player
        >
          <template #description>{{ player.singles_ch_date }}</template>
        </player-card>
        <loading-player
          v-else
          v-for="_ in 6"
          :key="_"
        />
      </u-page-grid>
      <error-message
        v-else
        :message="`No players who achieved the No. 1 singles ranking representing ${name}`"
      />
    </div>
    <div>
      <u-alert
        color="doubles"
        variant="subtle"
        title="Doubles No. 1s"
        class="w-full text-center mb-5"
      />
      <u-page-grid
        v-if="players.doubles_players.length || ['pending', 'idle'].includes(status)"
        class="xl:grid-cols-3 2xl:grid-cols-3"
      >
        <player-card
          v-if="players.doubles_players.length"
          v-for="player in players.doubles_players"
          :key="player.id"
          :player
        >
          <template #description>{{ player.doubles_ch_date }}</template>
        </player-card>
        <loading-player
          v-else
          v-for="_ in 6"
          :key="_"
        />
      </u-page-grid>
      <error-message
        v-else
        :message="`No players who achieved the No. 1 doubles ranking representing ${name}`"
      />
    </div>
  </div>
</template>
