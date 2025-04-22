<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const { active } = defineProps<{ active: boolean }>()

// API call
const { data: player, status } = await useFetch<PlayerDetailsType>("/api/player-details", { query: { id } })
</script>

<template>
  <dashboard-subpanel
    title="Overview"
    :icon="ICONS.overview"
  >
    <player-details-grid
      v-if="player"
      :player
      :active
    />
    <u-page-columns
      v-else-if="status === 'pending'"
      class="lg:columns-2 xl:columns-3 2xl:columns-3"
    >
      <details-loading-card
        v-for="_ in 10"
        :key="_"
      />
    </u-page-columns>
    <error-message
      v-if="!player"
      :icon="ICONS.noPlayer"
      :title="`No details found for ${name}`"
      :status
      :error="`Error fetching details for ${name}`"
    />
  </dashboard-subpanel>
</template>
