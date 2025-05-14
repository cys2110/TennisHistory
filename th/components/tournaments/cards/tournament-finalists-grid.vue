<script setup lang="ts">
defineProps<{ finalists: TournamentFinalistsInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid
    v-if="finalists.length || ['pending', 'idle'].includes(status)"
    class="lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    <u-page-card
      v-if="finalists.length"
      v-for="finalist in finalists"
      :key="finalist.player.id"
      :ui="{ description: 'text-sm', body: 'w-full', title: 'flex items-center gap-5 justify-between' }"
    >
      <template #title>
        <player-avatar
          :player="finalist.player"
          bold
        />
      </template>

      <template #description>
        <div class="flex items-center justify-between">
          <span>Finals Won/Played</span>
          <span class="font-semibold"
            >{{ finalist.wins }}/{{ finalist.wins + finalist.losses }} ({{ percentage(finalist.wins, finalist.wins + finalist.losses) }}%)</span
          >
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
    :icon="ICONS.noTournament"
    :message="`No players by finals found for ${name}`"
  />
</template>
