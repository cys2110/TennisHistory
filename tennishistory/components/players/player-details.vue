<script setup lang="ts">
defineProps<{ active: boolean }>()
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: player, status } = await useFetch<PlayerDetailsType>("/api/players/details", {
  query: { id: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
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
      v-else-if="['pending', 'idle'].includes(status)"
      class="lg:columns-2 xl:columns-3 2xl:columns-3"
    >
      <details-loading-card
        v-for="_ in 10"
        :key="_"
      />
    </u-page-columns>
    <error-message
      v-else
      :icon="ICONS.noPlayer"
      :title="`No details found for ${name}`"
    />
  </dashboard-subpanel>
</template>
