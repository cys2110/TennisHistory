<script setup lang="ts">
defineProps<{
  finalists: TournamentFinalistType[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const tournamentName = inject<string>("tournamentName", "")
</script>

<template>
  <u-page-grid
    v-if="finalists.length || status === 'pending'"
    class="2xl:grid-cols-4"
  >
    <u-card
      v-if="finalists.length"
      v-for="finalist in finalists"
      :key="finalist.player.id"
      :class="`ring-${getTourColor([finalist.player.tour])}`"
    >
      <template #header>
        <div class="flex justify-between items-center font-semibold">
          <player-link :player="finalist.player" />
          <u-badge
            :label="finalist.player.tour"
            :color="getTourColor([finalist.player.tour])"
          />
        </div>
      </template>

      <div class="w-full text-sm">
        <div class="grid grid-cols-4">
          <div></div>
          <div class="text-center">Titles</div>
          <div class="text-center">Runner-up</div>
          <div class="text-center">Win %</div>
        </div>

        <div class="grid grid-cols-4">
          <div>Singles</div>
          <div class="font-semibold text-center">{{ finalist.singles_wins }}</div>
          <div class="font-semibold text-center">{{ finalist.singles_losses }}</div>
          <div class="font-semibold text-center">
            {{
              finalist.singles_wins + finalist.singles_losses ?
                percentage(finalist.singles_wins, finalist.singles_wins + finalist.singles_losses)
              : 0
            }}%
          </div>
        </div>

        <div class="grid grid-cols-4">
          <div>Doubles</div>
          <div class="font-semibold text-center">{{ finalist.doubles_wins }}</div>
          <div class="font-semibold text-center">{{ finalist.doubles_losses }}</div>
          <div class="font-semibold text-center">
            {{
              finalist.doubles_wins + finalist.doubles_losses ?
                percentage(finalist.doubles_wins, finalist.doubles_wins + finalist.doubles_losses)
              : 0
            }}%
          </div>
        </div>
      </div>
    </u-card>
    <loading-player
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noTournament"
    :message="`No finalists found for ${tournamentName}`"
  />
</template>
