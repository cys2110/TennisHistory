<script setup lang="ts">
defineProps<{ scores: GamesSetsLostInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid
    v-if="scores.length || ['pending', 'idle'].includes(status)"
    class="lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    <u-page-card
      v-if="scores.length"
      v-for="score in scores"
      :key="score.year"
      :ui="{ description: 'text-sm', body: 'w-full', title: 'flex items-center gap-5 justify-between' }"
    >
      <template #title>
        <u-link
          class="hover-link w-fit"
          :to="{ name: 'event', params: { id: route.params.id as string, name: route.params.name as string, eid: score.id, year: score.year } }"
        >
          {{ score.year }}
        </u-link>
        <player-avatar
          :player="score.player"
          bold
        />
      </template>

      <template #description>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span>Sets Won</span>
            <span class="font-semibold">{{ score.sets_won }}/{{ score.sets_won + score.sets_lost }} ({{ score.sets_pc }}%)</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Games Won</span>
            <span class="font-semibold">{{ score.games_won }}/{{ score.games_won + score.games_lost }} ({{ score.games_pc }}%)</span>
          </div>
        </div>
      </template>
    </u-page-card>
    <base-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noScores"
    :message="`No score stats found for ${name}`"
  />
</template>
