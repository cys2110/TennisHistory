<script setup lang="ts">
defineProps<{
  seeds: SeedInterface[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const {
  params: { year }
} = useRoute()
const tournament = inject<TournamentInterface>("tournament")
</script>

<template>
  <u-page-grid
    v-if="seeds.length || status === 'pending'"
    class="2xl:grid-cols-4"
  >
    <u-card
      v-if="seeds.length"
      v-for="seed in seeds"
      :key="`${seed.tour}-${seed.draw}-${seed.type}-${seed.seed}`"
      :ui="{
        root: `ring-${getTourColor([seed.tour])}`,
        header: 'flex items-center justify-between'
      }"
    >
      <template #header>
        <div class="font-bold">{{ seed.seed }}</div>
        <div class="flex items-center gap-2">
          <u-badge
            :label="seed.tour"
            :color="getTourColor([seed.tour])"
          />
          <u-badge
            :label="seed.type"
            :color="seed.type === 'Singles' ? 'singles' : 'doubles'"
          />
          <u-badge
            :label="seed.draw"
            :color="seed.draw === 'Main' ? 'main' : 'qualifying'"
          />
        </div>
      </template>

      <div class="flex items-center justify-between">
        <player-link
          v-for="player in seed.team"
          :key="player.id"
          :player
        />
      </div>
    </u-card>

    <loading-base
      v-else
      v-for="n in 10"
      :key="n"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noPeople"
    :message="`No seeds in ${tournament?.name} ${year}`"
  />
</template>
